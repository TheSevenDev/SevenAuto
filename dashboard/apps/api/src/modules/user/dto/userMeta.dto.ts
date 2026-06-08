import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import type { JsonValue } from '@seven-auto/libs';
import { IUserMeta } from '@seven-auto/libs';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from 'src/dto/utils.dto';

import { UserDto } from './user.dto';

export type PrismaUserMeta = Prisma.UserMetaGetPayload<{
  include: { user: true };
}>;
export class UserMetaDto extends BaseEntityDto implements IUserMeta {
  constructor(userMeta: Partial<PrismaUserMeta>) {
    super();
    if (!userMeta) return;
    Object.assign(this, userMeta);
    this.user = userMeta.user ? new UserDto(userMeta.user) : undefined;
  }

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  value?: JsonValue;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: () => UserDto,
    required: false,
  })
  @IsOptional()
  user?: UserDto;
}
