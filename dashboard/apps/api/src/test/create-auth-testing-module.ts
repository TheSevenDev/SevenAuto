import { forwardRef, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaMock } from 'src/prisma/prisma.service.mock';

import { AuthController } from '../modules/auth/auth.controller';
import { AuthHelperService } from '../modules/auth/auth.helper';
import { AuthService } from '../modules/auth/auth.service';
import { EmailModule } from '../modules/email/email.module';
import { GlobalModule } from '../modules/global.module';
import { MediaModule } from '../modules/media/media.module';
import { QueuesModule } from '../modules/queues/queues.module';
import { QueuesEmailService } from '../modules/queues/service/queues-email.service';
import { QueuesNotificationService } from '../modules/queues/service/queues-notification.service';
import { QueuesTaskService } from '../modules/queues/service/queues-task.service';
import { UserModule } from '../modules/user/user.module';

@Module({
  providers: [
    {
      provide: QueuesEmailService,
      useValue: { sendEmail: jest.fn().mockResolvedValue(undefined) },
    },
    {
      provide: QueuesNotificationService,
      useValue: { sendNotification: jest.fn().mockResolvedValue(undefined) },
    },
    {
      provide: QueuesTaskService,
      useValue: { addTask: jest.fn().mockResolvedValue(undefined) },
    },
  ],
  exports: [QueuesEmailService, QueuesNotificationService, QueuesTaskService],
})
class MockQueuesModule {}

export async function createAuthTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      PrismaModule,
      GlobalModule,
      forwardRef(() => UserModule),
      forwardRef(() => MediaModule),
      EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthHelperService],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaMock)
    .overrideModule(QueuesModule)
    .useModule(MockQueuesModule)
    .compile();
}
