import { randomUUID } from 'node:crypto';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ENotificationType,
  EWebsocketMessageType,
  IWebsocketOnlineUser,
} from '@seven-auto/libs';
import { EnvService } from 'src/modules/env/env.service';

import { NotificationDto } from '../notification/notification.dto';
import { SystemNotificationDto } from './websocket.dto';
import { WebSocketsGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(
    @Inject(forwardRef(() => WebSocketsGateway))
    private websocketGateway: WebSocketsGateway,
    private readonly env: EnvService,
  ) {}

  async getOnlineUsers(args: IWebsocketOnlineUser): Promise<string[]> {
    const users = this.websocketGateway.getUsers();
    const onlineUsers = users
      .filter((user) => args.userIds.includes(user[0]))
      .map((user) => user[0]);
    return [...new Set(onlineUsers)];
  }

  async sendSystemNotification({ title, content }: SystemNotificationDto) {
    this.websocketGateway.handleSendAllUsers({
      type: EWebsocketMessageType.NOTIFICATION,
      data: {
        id: randomUUID(),
        type: ENotificationType.SYSTEM,
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async sendNotificationToUser({
    userId,
    data,
  }: {
    userId: string;
    data: NotificationDto;
  }) {
    this.websocketGateway.handleSendMessage({
      userId,
      data: {
        type: EWebsocketMessageType.NOTIFICATION,
        data: data as unknown as Record<string, unknown>,
      },
    });
  }

  async sendNotificationToUsers({
    userIds,
    data,
  }: {
    userIds: string[];
    data: NotificationDto;
  }) {
    userIds.forEach(async (userId) => {
      await this.sendNotificationToUser({ userId, data });
    });
  }
}
