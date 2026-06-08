import { Injectable } from '@nestjs/common';
import { ELanguage } from '@prisma/client';
import {
  EEmailTemplateKey,
  ENotificationType,
  fNumber,
  getDisplayName,
  INotificationComment,
  INotificationLike,
  INotificationPayment,
  paths,
} from '@seven-auto/libs';
import { WebsocketService } from 'src/modules/websocket/websocket.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { EmailHelper } from '../email/email.helper';
import { EnvService } from '../env/env.service';
import { UserQueryService } from '../user/service/userQuery.service';
import { NotificationDto } from './notification.dto';
import { notificationSelect } from './notification.select';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationHelper {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketService: WebsocketService,
    private readonly notificationService: NotificationService,
    private readonly emailHelper: EmailHelper,
    private readonly env: EnvService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async notificationLike({
    postId,
    fromUserId,
    toUserId,
  }: {
    postId: string;
    fromUserId: string;
    toUserId: string;
  }): Promise<void> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: toUserId },
      select: {
        id: true,
        setting: true,
      },
    });
    const userSetting = this.userQueryService.parseUser(prismaUser);
    const isNotifyLike = userSetting?.setting?.notification?.like || false;

    if (isNotifyLike) {
      const extra: INotificationLike = { postId, userId: fromUserId };
      const create = await this.prisma.notification.create({
        data: {
          type: ENotificationType.LIKE,
          extra: JSON.stringify(extra),
          title: 'New like',
          content: `You have a new like`,
          users: {
            createMany: {
              data: [{ userId: toUserId, read: false }],
            },
          },
        },
        select: {
          ...notificationSelect.basic,
          users: {
            where: { userId: toUserId },
            select: { id: true, read: true, readAt: true },
          },
        },
      });

      const notification = await this.notificationService.assignExtras(create);

      await this.websocketService.sendNotificationToUser({
        userId: toUserId,
        data: new NotificationDto(notification),
      });

      if (userSetting?.setting?.email?.like) {
        // TODO send email if active notification email
      }
    }
  }

  async notificationComment({
    postId,
    fromUserId,
    toUserId,
  }: {
    postId: string;
    fromUserId: string;
    toUserId: string;
  }): Promise<void> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: toUserId },
      select: {
        id: true,
        setting: true,
      },
    });
    const userSetting = this.userQueryService.parseUser(prismaUser);

    const isNotifyComment =
      userSetting?.setting?.notification?.comment || false;

    if (isNotifyComment) {
      const extra: INotificationComment = { postId, userId: fromUserId };
      const create = await this.prisma.notification.create({
        data: {
          type: ENotificationType.COMMENT,
          extra: JSON.stringify(extra),
          title: 'New comment',
          content: `You have a new comment`,
          users: {
            createMany: {
              data: [{ userId: toUserId, read: false }],
            },
          },
        },
        select: {
          ...notificationSelect.basic,
          users: {
            where: { userId: toUserId },
            select: { id: true, read: true, readAt: true },
          },
        },
      });

      const notification = await this.notificationService.assignExtras(create);

      await this.websocketService.sendNotificationToUser({
        userId: toUserId,
        data: new NotificationDto(notification),
      });

      if (userSetting?.setting?.email?.comment) {
        // TODO send email if active notification email
      }
    }
  }

  async notificationPayment({
    prisma,
    userId,
    paymentId,
    type,
    reason,
  }: {
    prisma?: PrismaService;
    userId: string;
    paymentId: string;
    type:
      | ENotificationType.PAYMENT_CREATED
      | ENotificationType.PAYMENT_APPROVED
      | ENotificationType.PAYMENT_REJECTED
      | ENotificationType.PAYMENT_REOPENED;
    reason?: string;
  }): Promise<void> {
    if (!prisma) prisma = this.prisma;
    const userSetting = await this.userQueryService.findOne({ id: userId });

    if (userSetting?.setting?.notification?.payment) {
      const extra: INotificationPayment = {
        paymentId,
        userId,
        reason,
      };
      const create = await prisma.notification.create({
        data: {
          type,
          extra: JSON.stringify(extra),
          title: 'Payment created',
          content: '',
          users: {
            createMany: {
              data: [{ userId, read: false }],
            },
          },
        },
        select: {
          ...notificationSelect.basic,
          users: {
            where: { userId },
            select: { id: true, read: true, readAt: true },
          },
        },
      });

      const notification = await this.notificationService.assignExtras(create);

      await this.websocketService.sendNotificationToUser({
        userId,
        data: new NotificationDto(notification),
      });

      if (userSetting?.setting?.email?.payment) {
        const extras = notification.extras as INotificationPayment;
        // variables: ['user_fullname', 'payment_id', 'price', 'payment_link', 'reason'],
        const variables = {
          user_fullname: getDisplayName(userSetting),
          payment_id: extras.payment?.uniqueId,
          price: fNumber(extras.payment?.price),
          payment_link: `${this.env.BASE_URL}${paths.checkout(extras.payment?.id)}`,
          reason,
        };

        let emailKey: EEmailTemplateKey | undefined;

        switch (type) {
          case ENotificationType.PAYMENT_CREATED:
            emailKey = EEmailTemplateKey.PAYMENT_CREATED;
            break;
          case ENotificationType.PAYMENT_APPROVED:
            emailKey = EEmailTemplateKey.PAYMENT_APPROVED;
            break;
          case ENotificationType.PAYMENT_REJECTED:
            emailKey = EEmailTemplateKey.PAYMENT_REJECTED;
            break;
          case ENotificationType.PAYMENT_REOPENED:
            emailKey = EEmailTemplateKey.PAYMENT_REOPENED;
            break;
        }

        if (emailKey) {
          await this.emailHelper.sendEmailTemplate({
            key: emailKey,
            lang: userSetting?.language || ELanguage.en,
            email: userSetting?.email || '',
            variables,
            prisma,
          });
        }
      }
    }
  }
}
