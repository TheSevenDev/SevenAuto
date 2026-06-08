import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  EActivityStatus,
  ELanguage,
  EUserGender,
  EUserStatus,
  Prisma,
} from '@prisma/client';
import type { JsonValue } from '@seven-auto/libs';
import {
  EUserLevel,
  IUser,
  IUserCreate,
  IUserFindMany,
  IUserFindOne,
  IUserUpdate,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiMediaOptional } from 'src/decorators/response/apiMedia.decorator';
import { ApiPostArrayOptional } from 'src/decorators/response/apiPost.decorator';
import { ApiUserMetaArrayOptional } from 'src/decorators/response/apiUserMeta.decorator';
import { BaseEntityDto, FindManyDto } from 'src/dto/utils.dto';
import { MediaDto } from 'src/modules/media/dto/media.dto';
import { PostDto } from 'src/modules/post/dto/post.dto';
import { RoleDto } from 'src/modules/role/role.dto';
import { QueryArrayParam } from 'src/transform/query-array.decorator';
import { transformArray } from 'src/transform/transform.array';
import { transformBoolean } from 'src/transform/transform.boolean';
import { transformDate } from 'src/transform/transform.date';
import { transformObject } from 'src/transform/transform.object';
import { OrderByQuery } from 'src/transform/transform-order-by';

import { UserSettingDto } from './user-setting.dto';
import { UserStatsDto } from './user-stats.dto';
import { UserMetaDto } from './userMeta.dto';

export type PrismaUser = Prisma.UserGetPayload<{
  include: { _count: true; metas: true };
}>;
export class UserDto extends BaseEntityDto implements IUser {
  constructor(user: Partial<PrismaUser>) {
    super();
    if (!user) return;
    const __count = user?._count;
    if (user?._count) delete user._count;
    Object.assign(this, user);
    this.countPost = __count?.posts || 0;
    this.metas = user?.metas?.map((meta) => new UserMetaDto(meta));
    this.setting = user?.setting ? new UserSettingDto(user.setting) : undefined;
  }

  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => transformObject(value))
  socials?: JsonValue;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  countPost?: number;

  @ApiProperty({ type: 'boolean', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return transformBoolean(value);
  })
  isVerified?: boolean;

  @ApiProperty({ enum: EUserStatus, example: 'ACTIVE', required: false })
  @IsString()
  @IsOptional()
  status?: EUserStatus;

  @ApiProperty({ type: 'boolean', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  deleted?: boolean;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  avatarId?: string;

  @ApiMediaOptional()
  avatar?: MediaDto;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  coverId?: string;

  @ApiMediaOptional()
  cover?: MediaDto;

  @ApiUserMetaArrayOptional()
  metas?: UserMetaDto[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  roleId?: string;

  @ApiProperty({ type: RoleDto, required: false })
  @IsObject()
  @IsOptional()
  role?: RoleDto;

  @ApiPostArrayOptional()
  posts?: PostDto[];

  @ApiProperty({ enum: EUserLevel, example: EUserLevel.BASIC, required: false })
  @IsString()
  @IsOptional()
  level?: EUserLevel;

  @ApiProperty({
    enum: EActivityStatus,
    example: EActivityStatus.OFFLINE,
    required: false,
  })
  @IsString()
  @IsOptional()
  activityStatus?: EActivityStatus;

  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => transformDate(value))
  lastActivity?: Date;

  @ApiProperty({ enum: ELanguage, example: ELanguage.vi, required: false })
  @IsString()
  @IsOptional()
  language?: ELanguage;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'content', required: false })
  referrerId?: string;

  @ApiProperty({ type: () => UserDto, required: false, example: {} })
  @IsObject()
  @IsOptional()
  referrer?: UserDto;

  @ApiProperty({ type: () => [UserDto], example: [], required: false })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => transformArray(value, 'object'))
  members?: UserDto[];

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  score?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  credits?: number;

  @ApiProperty({ type: () => UserSettingDto, example: {}, required: false })
  @IsObject()
  @IsOptional()
  setting?: UserSettingDto;

  @ApiProperty({
    enum: EUserGender,
    example: EUserGender.MALE,
    required: false,
  })
  @IsString()
  @IsOptional()
  gender?: EUserGender;
}

export class UserFindOneDto implements IUserFindOne {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: '', required: false })
  id?: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'xxx', required: false })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'example', required: false })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'example', required: false })
  address?: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: () => UserStatsDto, required: false })
  stats?: UserStatsDto;
}

export class UserFindManyDto extends FindManyDto implements IUserFindMany {
  @ApiProperty({
    enum: EUserStatus,
    example: [EUserStatus.ACTIVE],
    enumName: 'EUserStatus',
    isArray: true,
    required: false,
  })
  @QueryArrayParam('string')
  status?: EUserStatus[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: true, required: false })
  @Transform(({ value }) => transformBoolean(value))
  isVerified?: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty({ type: 'number', example: 0, required: false })
  @Transform(({ value }) => Number(value))
  deleted?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'example', required: false })
  referrerId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'example', required: false })
  roleId?: string;

  @ApiProperty({
    enum: EUserLevel,
    example: [EUserLevel.BASIC],
    enumName: 'EUserLevel',
    isArray: true,
    required: false,
  })
  @QueryArrayParam('string')
  levels?: EUserLevel[];

  @ApiProperty({
    enum: EUserGender,
    example: [EUserGender.MALE],
    enumName: 'EUserGender',
    isArray: true,
    required: false,
  })
  @QueryArrayParam('string')
  genders?: EUserGender[];

  @OrderByQuery()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}

export class UserCreateDto implements IUserCreate {
  @IsEmail({}, { message: 'Email is invalid' })
  @MaxLength(50, { message: 'Email is too long' })
  @ApiProperty({ type: 'string', example: 'example@gmail.com', required: true })
  email: string;

  @IsString()
  @ApiProperty({ type: 'string', example: 'example', required: true })
  fullname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'example', required: false })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: '******', required: false })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    enum: EUserStatus,
    example: EUserStatus.ACTIVE,
    required: false,
  })
  status?: EUserStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: '', required: false })
  avatar?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: false, required: false })
  sendMail?: boolean = false;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'content', required: false })
  roleId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: false, required: false })
  @Transform(({ value }) => transformBoolean(value))
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'phone', required: false })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'avatar', required: false })
  avatarId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'avatar', required: false })
  coverId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'description', required: false })
  about?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'content', required: false })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'address', required: false })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'country', required: false })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'region', required: false })
  region?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'city', required: false })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'zipCode', required: false })
  zipCode?: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ type: 'object', additionalProperties: true })
  @Transform(({ value }) => transformObject(value))
  socials?: Record<string, unknown>;

  @ApiProperty({ enum: EUserLevel, example: EUserLevel.BASIC, required: false })
  @IsString()
  @IsOptional()
  level?: EUserLevel;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'zipCode', required: false })
  referrerId?: string;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  score?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  credits?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  baseCredits?: number;

  @ApiProperty({
    enum: EActivityStatus,
    example: EActivityStatus.OFFLINE,
    required: false,
  })
  @IsString()
  @IsOptional()
  activityStatus?: EActivityStatus;

  @ApiProperty({ enum: ELanguage, example: ELanguage.vi, required: false })
  @IsString()
  @IsOptional()
  language?: ELanguage;

  @ApiProperty({
    enum: EUserGender,
    example: EUserGender.MALE,
    required: false,
  })
  @IsString()
  @IsOptional()
  gender?: EUserGender;

  @ApiProperty({
    type: () => UserSettingDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  setting?: UserSettingDto;
}

export class UserUpdateDto
  extends PartialType(UserCreateDto)
  implements IUserUpdate
{
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: 'username', required: false })
  id: string;
}
