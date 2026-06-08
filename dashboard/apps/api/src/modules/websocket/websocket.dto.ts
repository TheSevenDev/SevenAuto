import { ApiProperty } from '@nestjs/swagger';
import {
  type ISystemNotification,
  type IWebsocketOnlineUser,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { transformArray } from 'src/transform/transform.array';

export class SystemNotificationDto implements ISystemNotification {
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: true,
  })
  @IsString()
  @IsOptional()
  content?: string;
}

export class WebsocketOnlineUserDto implements IWebsocketOnlineUser {
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: true,
  })
  @IsArray()
  @Transform(({ value }) => transformArray(value))
  userIds: string[];
}
