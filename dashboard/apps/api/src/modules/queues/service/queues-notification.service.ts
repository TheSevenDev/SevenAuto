import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { INotification } from '@seven-auto/libs';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesNotificationService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async sendNotificationSystem({
    data,
  }: {
    data: INotification;
  }): Promise<void> {
    await this.notificationQueue.add('sendNotificationSystem', { data });
  }
}
