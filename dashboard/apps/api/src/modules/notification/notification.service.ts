import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EStatusProcess, Prisma } from '@prisma/client';
import {
  ENotificationType,
  hasPermission,
  IFindManyResponse,
  INotificationFindMany,
  INotificationPayment,
  INotificationStats,
  INotificationSystem,
  IPayment,
  IUser,
  NotificationExtras,
  permissions,
} from '@seven-auto/libs';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserQueryService } from '../user/service/userQuery.service';
import { NotificationDto, PrismaNotification } from './notification.dto';
import { notificationSelect } from './notification.select';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async findMany({
    args,
    currentUser,
  }: {
    args: INotificationFindMany;
    currentUser: IUser;
  }): Promise<IFindManyResponse<NotificationDto>> {
    const { take, skip, types, filter, unread } = args;

    if (!currentUser) return { items: [], total: 0 };

    const where: Prisma.NotificationWhereInput = {};

    if (types && types.length) {
      where.type = { in: types };
    }

    if (filter) {
      where.OR = [
        { title: { contains: filter } },
        { content: { contains: filter } },
        { extra: { string_contains: filter } },
      ];
    }
    if (unread) {
      where.AND = [
        {
          OR: [
            {
              isGlobal: true,
              users: { none: { userId: currentUser.id } },
            },
            {
              isGlobal: false,
              users: {
                some: { userId: currentUser.id, read: false },
              },
            },
          ],
        },
      ];
    } else {
      where.AND = [
        {
          OR: [
            { isGlobal: true },
            {
              isGlobal: false,
              users: { some: { userId: currentUser.id } },
            },
          ],
        },
      ];
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          ...notificationSelect.basic,
          users: {
            where: { userId: currentUser.id },
            select: { id: true, read: true, readAt: true },
          },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    const promise = notifications.map(async (notification) => {
      const newNotification = await this.assignExtras(notification);
      return new NotificationDto(newNotification);
    });

    const data = await Promise.all(promise);

    return { items: data, total };
  }

  async stats({
    currentUser,
  }: {
    currentUser: IUser;
  }): Promise<INotificationStats> {
    if (!currentUser) return { total: 0, unread: 0 };

    const total = await this.prisma.notification.count({
      where: {
        OR: [
          { isGlobal: true },
          {
            isGlobal: false,
            users: { some: { userId: currentUser.id } },
          },
        ],
      },
    });

    const unread = await this.prisma.notification.count({
      where: {
        OR: [
          {
            isGlobal: true,
            users: { none: { userId: currentUser.id } },
          },
          {
            isGlobal: false,
            users: {
              some: { userId: currentUser.id, read: false },
            },
          },
        ],
      },
    });

    return { total, unread };
  }

  async read({
    id,
    currentUser,
  }: {
    id: string;
    currentUser: IUser;
  }): Promise<boolean> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) return false;

    if (notification.isGlobal) {
      await this.prisma.notificationUser.create({
        data: {
          readAt: new Date(),
          read: true,
          notificationId: id,
          userId: currentUser.id,
        },
      });
    } else {
      await this.prisma.notificationUser.update({
        where: {
          userId_notificationId: { userId: currentUser.id, notificationId: id },
        },
        data: { readAt: new Date(), read: true },
      });
    }

    return true;
  }

  async readAll({ currentUser }: { currentUser: IUser }): Promise<boolean> {
    const notifications = await this.prisma.notification.findMany({
      where: { isGlobal: true, users: { none: { userId: currentUser.id } } },
    });

    await Promise.all(
      notifications.map((notification) =>
        this.prisma.notificationUser.create({
          data: {
            readAt: new Date(),
            read: true,
            notification: { connect: { id: notification.id } },
            user: { connect: { id: currentUser.id } },
          },
        }),
      ),
    );

    const userNotifications = await this.prisma.notificationUser.findMany({
      where: { userId: currentUser.id, read: false },
    });

    await Promise.all(
      userNotifications.map((userNotification) =>
        this.prisma.notificationUser.update({
          where: { id: userNotification.id },
          data: { readAt: new Date(), read: true },
        }),
      ),
    );

    return true;
  }

  async assignExtras(
    notification: PrismaNotification,
    prisma?: PrismaService,
  ): Promise<PrismaNotification & { extras?: NotificationExtras }> {
    if (!prisma) prisma = this.prisma;
    if (!notification) return notification;
    if (!notification.extra || !notification.type) {
      delete notification.extra;
      return notification;
    }
    let extra;
    try {
      const rawExtra =
        typeof notification.extra === 'string'
          ? notification.extra
          : JSON.stringify(notification.extra);
      extra = JSON.parse(rawExtra);
    } catch {
      console.error('Error parsing notification extra', notification.extra);
    }

    if (typeof extra !== 'object') {
      return notification;
    }

    switch (notification.type) {
      case ENotificationType.PAYMENT_CREATED:
      case ENotificationType.PAYMENT_APPROVED:
      case ENotificationType.PAYMENT_REJECTED:
      case ENotificationType.PAYMENT_REOPENED:
        {
          const extras: INotificationPayment = {
            ...extra,
          };
          if (extras.paymentId) {
            const payment = await prisma.payment.findUnique({
              where: { id: extras.paymentId },
            });
            extras.payment = payment as IPayment;
          }
          if (extras.userId) {
            const prismaUser = await prisma.user.findUnique({
              where: { id: extras.userId },
              include: { avatar: true },
            });
            const user = this.userQueryService.parseUser(prismaUser);
            extras.user = user;
          }
          Object.assign(notification, { extras });
        }
        break;
    }

    delete notification.extra;
    return notification;
  }

  async system({
    currentUser,
  }: {
    currentUser: IUser;
  }): Promise<INotificationSystem> {
    const result: INotificationSystem = {
      payment: 0,
      manage: {
        payment: 0,
      },
    };

    result.payment = await this.prisma.payment.count({
      where: { status: EStatusProcess.PENDING, userId: currentUser.id },
    });

    const isAdminPayment = hasPermission(currentUser, [
      permissions.PAYMENT_MANAGE,
    ]);
    if (isAdminPayment) {
      result.manage.payment = await this.prisma.payment.count({
        where: { status: EStatusProcess.PENDING },
      });
    }

    return result;
  }

  /**
   * Delete old notifications after 30 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldNotifications() {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    await this.prisma.notificationUser.deleteMany({
      where: { createdAt: { lt: date } },
    });

    await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
}
