import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesTaskService {
  constructor(@InjectQueue('task') private taskQueue: Queue) {}

  async placeholder({ userId }: { userId: string }): Promise<void> {
    await this.taskQueue.add('placeholder', { userId });
  }
}
