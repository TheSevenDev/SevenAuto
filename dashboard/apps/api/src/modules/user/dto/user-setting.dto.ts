import { ApiProperty } from '@nestjs/swagger';
import { IUserSetting } from '@seven-auto/libs';
import { IsObject, IsOptional } from 'class-validator';

export class UserSettingDto implements IUserSetting {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(setting: any) {
    if (!setting) return;
    if (typeof setting === 'string') {
      try {
        Object.assign(this, JSON.parse(setting));
      } catch {
        // Ignore invalid JSON string
      }
    } else if (typeof setting === 'object') {
      Object.assign(this, setting);
    }
  }

  @IsObject()
  @IsOptional()
  notification: {
    like: boolean;
    comment: boolean;
    payment: boolean;
  };

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      like: true,
      comment: true,
      payment: true,
    },
  })
  @IsObject()
  @IsOptional()
  email: {
    like: boolean;
    comment: boolean;
    payment: boolean;
  };
}
