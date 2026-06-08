import { randomUUID } from 'node:crypto';

import { forwardRef, Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  type IWebsocketMessage,
  websocketReceiveKey,
  websocketSendKey,
} from '@seven-auto/libs';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  namespace: '/',
  path: '/wss',
  cors: {
    origin: '*', // Allow all origins
  },
})
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocketService: WebsocketService,
  ) {}

  @WebSocketServer()
  server: Server;

  private users = new Map<string, string[]>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (this.users.has(userId)) {
        // If userId already exists in Map, add socketId to the list
        this.users.get(userId)?.push(client.id);
      } else {
        // If userId does not exist, create a new list
        this.users.set(userId, [client.id]);
      }
      // console.log(`Client connected: ${client.id} (User ID: ${userId})`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.users].find(([, value]) =>
      value.includes(client.id),
    )?.[0];
    if (userId) {
      const socketIds = this.users.get(userId);
      if (socketIds) {
        // Remove socketId of the closed tab
        const updatedSocketIds = socketIds.filter((id) => id !== client.id);
        if (updatedSocketIds.length > 0) {
          this.users.set(userId, updatedSocketIds);
        } else {
          // Delete userId if there are no more connected tabs
          void this.prisma.user
            .update({
              where: { id: userId },
              data: { lastActivity: new Date() },
            })
            .then(() => {
              this.users.delete(userId);
            });
        }
      }
      // console.log(`Client disconnected: ${client.id} (User ID: ${userId})`);
    }
  }

  // Get socketId by userId
  getSocketIdsByUserId(userId: string): string[] | undefined {
    return this.users.get(userId);
  }

  handleSendAllUsers(payload: Omit<IWebsocketMessage, 'id'>) {
    this.server.emit(websocketReceiveKey, {
      id: randomUUID(),
      ...payload,
    });
  }

  handleSendMessage(payload: {
    userId: string;
    data: Omit<IWebsocketMessage, 'id'>;
  }) {
    const { userId, data } = payload;
    const targetSocketIds = this.getSocketIdsByUserId(userId);
    if (targetSocketIds && targetSocketIds.length > 0) {
      targetSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit(websocketReceiveKey, {
          id: randomUUID(),
          ...data,
        });
      });
    }
  }

  @SubscribeMessage(websocketSendKey)
  async handleReceiveMessage(
    client: Socket,
    payload: IWebsocketMessage,
  ): Promise<void> {
    console.log('handleReceiveMessage', payload);
  }

  getUsers() {
    return [...this.users.entries()];
  }
}
