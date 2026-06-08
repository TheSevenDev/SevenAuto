import { Processor, WorkerHost } from '@nestjs/bullmq';
import { INotification } from '@seven-auto/libs';
import { Job } from 'bullmq';
import { NotificationService } from 'src/modules/notification/notification.service';
import { WebsocketService } from 'src/modules/websocket/websocket.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('notification')
export class QueuesNotificationProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketService: WebsocketService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<INotification>): Promise<void> {
    const { data, name } = job;
    // TODO: implement notification processor
    console.log('Processed job:', `"${name}"`, ' with data:', data);
    return null;
  }
}
