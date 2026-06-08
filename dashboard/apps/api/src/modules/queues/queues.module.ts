import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { forwardRef, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import express from 'express';
import basicAuth from 'express-basic-auth';
import { EnvService } from 'src/modules/env/env.service';
import { UserModule } from 'src/modules/user/user.module';

import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { QueuesEmailProcessor } from './processor/queues-email.processor';
import { QueuesNotificationProcessor } from './processor/queues-notification.processor';
import { QueuesTaskProcessor } from './processor/queues-task.processor';
import { QueuesController } from './queues.controller';
import { QueuesEmailService } from './service/queues-email.service';
import { QueuesNotificationService } from './service/queues-notification.service';
import { QueuesTaskService } from './service/queues-task.service';

const defaultJobOptions = {
  // removeOnComplete: true,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
};

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        connection: {
          url: envService.REDIS_URL,
          ...(process.env.NODE_ENV === 'test' && {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            lazyConnect: true,
          }),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'task',
      defaultJobOptions: {
        ...defaultJobOptions,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        ...defaultJobOptions,
      },
    }),
    BullModule.registerQueue({
      name: 'notification',
      defaultJobOptions: {
        ...defaultJobOptions,
      },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => WebsocketModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [QueuesController],
  providers: [
    QueuesTaskService,
    QueuesEmailService,
    QueuesNotificationService,
    QueuesTaskProcessor,
    QueuesEmailProcessor,
    QueuesNotificationProcessor,
  ],
  exports: [QueuesTaskService, QueuesEmailService, QueuesNotificationService],
})
export class QueuesModule implements OnModuleDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server: any;

  constructor(
    private env: EnvService,
    @InjectQueue('task') private taskQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {
    // Only start the server in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      this.startBullBoard();
    }
  }

  private startBullBoard() {
    const logger = new Logger('App-Log');
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(`/${this.env.QUEUES_PATH}`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard(
      {
        queues: [
          new BullMQAdapter(this.taskQueue),
          new BullMQAdapter(this.emailQueue),
          new BullMQAdapter(this.notificationQueue),
        ],
        serverAdapter: serverAdapter,
      },
    );

    const app = express();
    if (this.env.QUEUES_LOCKED) {
      app.use(
        `/${this.env.QUEUES_PATH}`,
        basicAuth({
          users: { [this.env.QUEUES_USER]: this.env.QUEUES_PASSWORD },
          challenge: true,
        }),
        serverAdapter.getRouter(),
      );
    } else {
      app.use(`/${this.env.QUEUES_PATH}`, serverAdapter.getRouter());
    }

    this.server = app.listen(this.env.QUEUES_PORT, () => {
      logger.log(`==================== Queues ====================`);
      logger.log(
        `Bull Board is running on http://localhost:${this.env.QUEUES_PORT}/${this.env.QUEUES_PATH}`,
      );
      logger.log(`==============================================`);
    });
  }

  onModuleDestroy() {
    if (this.server) {
      this.server.close();
    }
  }
}
