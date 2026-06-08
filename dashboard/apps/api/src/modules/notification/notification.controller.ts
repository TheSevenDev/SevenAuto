import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  IFindManyResponse,
  INotificationStats,
  INotificationSystem,
  type IUser,
} from '@seven-auto/libs';
import {
  ApiFindManyResponse,
  ApiSuccessBooleanResponse,
  ApiSuccessObjResponse,
} from 'src/decorators/apiResponse.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import {
  NotificationDto,
  NotificationFindManyDto,
  NotificationStatsDto,
  NotificationSystemDto,
} from './notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/system')
  @ApiOperation({ summary: 'get notification system' })
  @ApiSuccessObjResponse(NotificationSystemDto)
  async getSystems(
    @CurrentUser() currentUser: IUser,
  ): Promise<INotificationSystem> {
    return this.notificationService.system({ currentUser });
  }

  @Get('/stats')
  @ApiOperation({ summary: 'get notification stats' })
  @ApiSuccessObjResponse(NotificationStatsDto)
  async stats(@CurrentUser() currentUser: IUser): Promise<INotificationStats> {
    return this.notificationService.stats({ currentUser });
  }

  @Get('/')
  @ApiOperation({ summary: 'get all notification' })
  @ApiFindManyResponse(NotificationDto)
  findMany(
    @Query() args: NotificationFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<NotificationDto>> {
    return this.notificationService.findMany({ args, currentUser });
  }

  @Post('/read/all')
  @ApiSuccessBooleanResponse()
  @ApiOperation({ summary: 'mark all notification as read' })
  readAll(@CurrentUser() currentUser: IUser): Promise<boolean> {
    return this.notificationService.readAll({ currentUser });
  }

  @Post('/read/:id')
  @ApiSuccessBooleanResponse()
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({ summary: 'mark notification as read' })
  read(
    @Param('id', XSSFilterPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<boolean> {
    return this.notificationService.read({ id, currentUser });
  }
}
