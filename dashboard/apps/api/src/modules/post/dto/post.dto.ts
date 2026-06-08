import { ApiProperty } from '@nestjs/swagger';
import { EPostStatus } from '@prisma/client';
import { type IMedia, type IPost } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { SeoMetaDto } from 'src/dto/seoMeta.dto';
import { BaseEntityDto } from 'src/dto/utils.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { MediaDto } from 'src/modules/media/dto/media.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { transformArray } from 'src/transform/transform.array';
import { transformBoolean } from 'src/transform/transform.boolean';

import { PostMetaDto } from './postMeta.dto';

export class PostDto extends BaseEntityDto implements IPost {
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsInt()
  @IsOptional()
  views?: number;

  @ApiProperty({
    enum: EPostStatus,
    example: [EPostStatus.DRAFT],
    enumName: 'EPostStatus',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: EPostStatus;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  source?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: true, required: false })
  @Transform(({ value }) => transformBoolean(value))
  hot?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: true, required: false })
  @Transform(({ value }) => transformBoolean(value))
  deleted?: boolean;

  @ApiProperty({ type: 'string', example: new Date(), required: false })
  @IsDate()
  @IsOptional()
  publishDate?: Date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: true, required: false })
  @Transform(({ value }) => transformBoolean(value))
  canComment?: boolean;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  authorId?: string;

  @ApiProperty({ type: () => UserDto, example: 'example', required: false })
  @IsOptional()
  @IsObject()
  author?: UserDto;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  @IsOptional()
  mediaId?: string;

  @ApiProperty({ type: () => MediaDto, example: 'example', required: false })
  @IsOptional()
  @IsObject()
  media?: IMedia;

  @ApiProperty({ type: () => [PostMetaDto], example: [], required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value, 'object'))
  metas?: PostMetaDto[];

  @ApiProperty({ type: () => [CategoryDto], example: {}, required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value, 'object'))
  categories?: CategoryDto[];

  @ApiProperty({ type: () => [PostDto], example: {}, required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value, 'object'))
  related?: PostDto[];

  @ApiProperty({ type: () => [PostDto], example: 'example', required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value, 'object'))
  postRelated?: PostDto[];

  @ApiProperty({ type: () => SeoMetaDto, example: {}, required: false })
  @IsOptional()
  @IsObject()
  seoMeta?: SeoMetaDto;
}
