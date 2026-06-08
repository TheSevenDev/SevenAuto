import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesEmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendEmail({
    email,
    title,
    textSend,
  }: {
    email: string;
    title: string;
    textSend: string;
  }): Promise<void> {
    await this.emailQueue.add('sendEmail', { email, title, textSend });
  }
}
