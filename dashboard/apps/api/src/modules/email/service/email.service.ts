import { Injectable } from '@nestjs/common';
import { ELanguage } from '@prisma/client';
import { EEmailTemplateKey, validateEmail } from '@seven-auto/libs';
import { createTransport } from 'nodemailer';
import { EnvService } from 'src/modules/env/env.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { makeANiceEmail } from '../email.const';
import { EmailSendDto, EmailSendMultiDto } from '../email.dto';
@Injectable()
export class EmailService {
  private transport: ReturnType<typeof createTransport> | null = null;

  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
  ) {}

  async getTransport() {
    if (!this.transport) {
      this.transport = createTransport({
        pool: true,
        secure: this.env.EMAIL_SECURE,
        host: this.env.EMAIL_HOST,
        port: this.env.EMAIL_PORT,
        auth: {
          user: this.env.EMAIL_USER,
          pass: this.env.EMAIL_PASS,
        },
      });
    }
    return this.transport;
  }

  async getTemplate(
    key: EEmailTemplateKey,
    lang: ELanguage,
    prisma?: PrismaService,
  ): Promise<{
    title: string;
    content: string;
  }> {
    if (!prisma) prisma = this.prisma;
    const result = { title: '', content: '' };
    const template = await prisma.emailTemplate.findUnique({
      where: { key },
      include: { langs: { where: { lang } } },
    });

    if (!template) return result;
    if (template.langs && template.langs.length) {
      result.title = template.langs[0].title;
      result.content = template.langs[0].content;
      return result;
    }
    result.title = template.title;
    result.content = template.content;
    return result;
  }

  async send({
    email,
    fromName,
    replyTo,
    title,
    textSend,
    logo,
  }: EmailSendDto): Promise<boolean> {
    if (!this.env.EMAIL_ENABLED) return true;

    try {
      if (email) {
        const transport = await this.getTransport();
        const result = await transport.sendMail({
          from: {
            name: fromName || this.env.EMAIL_NAME,
            address: this.env.EMAIL_REPLY,
          },
          replyTo: replyTo || this.env.EMAIL_REPLY,
          to: email,
          text: `Email from ${this.env.APP_NAME}`,
          subject: title,
          html: makeANiceEmail(
            textSend,
            logo || `${this.env.ASSETS_URL}/logo.png`,
          ),
        });
        return result;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMulti(args: EmailSendMultiDto): Promise<boolean> {
    if (!args.listEmail.length) return;
    if (!this.env.EMAIL_ENABLED || !this.env.EMAIL_USER) return true;

    // remove invalid email format
    const listEmail = args.listEmail.filter((email) => validateEmail(email));

    // foreach email and delay 1-5 seconds
    let successCount = 0;
    for (const email of listEmail) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 4000 + 1000),
      );
      const res = await this.send({ ...args, email });
      if (res) successCount += 1;
    }
    return successCount === listEmail.length;
  }

  async sendMultiBcc(args: EmailSendMultiDto): Promise<boolean> {
    if (!args.listEmail.length) return;
    // if (!this.env.EMAIL_ENABLED || !this.env.EMAIL_USER) return true;

    // remove invalid email format
    const listEmail = args.listEmail.filter((email) => validateEmail(email));

    try {
      const transport = await this.getTransport();
      const result = await transport.sendMail({
        from: {
          name: args.fromName || this.env.EMAIL_NAME,
          address: args.replyTo || this.env.EMAIL_REPLY,
        },
        replyTo: args.replyTo || this.env.EMAIL_REPLY,
        to: this.env.EMAIL_USER,
        bcc: listEmail,
        text: `Email from ${this.env.APP_NAME}`,
        subject: args.title,
        html: makeANiceEmail(
          args.textSend,
          args.logo || `${this.env.ASSETS_URL}/logo.png`,
        ),
      });
      return result;
    } catch (error) {
      console.log('🚀 ~ EmailService ~ sendMultiBcc ~ error', error);
    }
  }
}
