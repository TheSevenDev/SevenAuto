import { Processor, WorkerHost } from '@nestjs/bullmq';
import { IEmailSend } from '@seven-auto/libs';
import { Job } from 'bullmq';
import { EmailService } from 'src/modules/email/service/email.service';

@Processor('email')
export class QueuesEmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<IEmailSend>): Promise<boolean> {
    const { data, name } = job;
    if (!name) {
      console.log('Processed job:', `"${name}"`, ' with data:', data);
      return null;
    }

    if (name === 'sendEmail') {
      const result = await this.sendEmail(data);
      return result;
    }

    console.log('Processed job:', `"${name}"`, ' with data:', data);
    return null;
  }

  async sendEmail({
    email,
    title,
    textSend,
  }: {
    email: string;
    title: string;
    textSend: string;
  }): Promise<boolean> {
    const result = await this.emailService.send({
      email,
      title,
      textSend,
    });
    return result;
  }
}
