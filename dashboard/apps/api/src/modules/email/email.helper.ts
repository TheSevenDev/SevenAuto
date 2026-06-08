import { Injectable } from '@nestjs/common';
import { ELanguage } from '@prisma/client';
import { EEmailTemplateKey, parseVariables } from '@seven-auto/libs';
import { QueuesEmailService } from 'src/modules/queues/service/queues-email.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { EmailService } from './service/email.service';

@Injectable()
export class EmailHelper {
  constructor(
    private readonly emailService: EmailService,
    private readonly queuesEmailService: QueuesEmailService,
  ) {}

  async sendEmailTemplate({
    key,
    lang,
    email,
    variables,
    prisma,
  }: {
    key: EEmailTemplateKey;
    lang: ELanguage;
    email: string;
    variables: Record<string, string>;
    prisma?: PrismaService;
  }): Promise<boolean> {
    // Send Mail
    const templateMail = await this.emailService.getTemplate(key, lang, prisma);

    if (templateMail && templateMail.title && templateMail.content) {
      await this.queuesEmailService.sendEmail({
        email,
        title: parseVariables(templateMail.title, variables),
        textSend: parseVariables(templateMail.content, variables),
      });
      // await this.emailService.send({
      //   email,
      //   title: parseVariables(templateMail.title, variables),
      //   textSend: parseVariables(templateMail.content, variables),
      // });
    }

    return true;
  }
}
