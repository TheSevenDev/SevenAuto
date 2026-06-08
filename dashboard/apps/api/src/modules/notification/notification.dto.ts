import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  ENotificationType,
  INotification,
  INotificationFindMany,
  INotificationStats,
  INotificationSystem,
  type NotificationExtras,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntityDto, FindManyDto } from 'src/dto/utils.dto';
import { QueryArrayParam } from 'src/transform/query-array.decorator';
import { transformBoolean } from 'src/transform/transform.boolean';

export type PrismaNotification = Prisma.NotificationGetPayload<{
  include: { users: { select: { id: true; read: true; readAt: true } } };
}>;

export class NotificationDto extends BaseEntityDto implements INotification {
  constructor(notification: Partial<PrismaNotification>) {
    super();
    if (!notification) return;

    if (notification.isGlobal) {
      const read = notification.users.every((user) => user.read);
      Object.assign(notification, { read });
      Object.assign(notification, {
        readAt: read ? notification?.users[0]?.readAt : null,
      });
    } else {
      const user = notification.users ? notification.users[0] : null;
      Object.assign(notification, { read: user?.read || false });
      Object.assign(notification, { readAt: user?.readAt });
    }

    delete notification.users;
    delete notification.isGlobal;

    Object.assign(this, notification);
  }

  @ApiProperty({
    enum: ENotificationType,
    example: ENotificationType.SYSTEM,
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: ENotificationType;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  extras?: NotificationExtras;

  @ApiProperty({ type: 'boolean', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => transformBoolean(value))
  read?: boolean;

  @ApiProperty({
    type: 'string',
    example: '2021-09-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readAt?: Date;
}

export class NotificationFindManyDto
  extends FindManyDto
  implements INotificationFindMany
{
  @ApiProperty({
    enum: ENotificationType,
    example: [ENotificationType.SYSTEM],
    enumName: 'ENotificationType',
    isArray: true,
    required: false,
  })
  @QueryArrayParam('string')
  types?: ENotificationType[];

  @ApiProperty({ type: 'boolean', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => transformBoolean(value))
  unread?: boolean;
}

export class NotificationStatsDto implements INotificationStats {
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  total: number;

  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  unread: number;
}

export class NotificationSystemDto implements INotificationSystem {
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsNumber()
  payment: number;

  @ApiProperty({
    example: {
      payment: 0,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  manage?: {
    payment: number;
  };
}
