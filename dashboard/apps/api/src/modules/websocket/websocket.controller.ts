import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { permissions } from '@seven-auto/libs';
import { Permissions } from 'src/decorators/permissions.decorator';

import { SystemNotificationDto, WebsocketOnlineUserDto } from './websocket.dto';
import { WebsocketService } from './websocket.service';

@Controller('websocket')
@ApiTags('websocket')
export class WebsocketController {
  constructor(private readonly websocketService: WebsocketService) {}

  @Post('send-system-notification')
  @ApiBearerAuth()
  @Permissions(permissions.SUPER_ADMIN)
  async sendSystemNotification(
    @Body() args: SystemNotificationDto,
  ): Promise<string> {
    await this.websocketService.sendSystemNotification(args);
    return `System notification sent to all users`;
  }

  @Get('online-users')
  async getOnlineUsers(
    @Query() args: WebsocketOnlineUserDto,
  ): Promise<string[]> {
    return this.websocketService.getOnlineUsers(args);
  }
}
