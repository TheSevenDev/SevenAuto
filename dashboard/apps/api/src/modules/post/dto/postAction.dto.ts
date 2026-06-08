import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EPostStatus } from '@prisma/client';
import { IPostCreate, IPostUpdate, ISeoMeta } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { SeoMetaDto } from 'src/dto/seoMeta.dto';
import { transformArray } from 'src/transform/transform.array';
import { transformBoolean } from 'src/transform/transform.boolean';

export class PostCreateDto implements IPostCreate {
  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  slug?: string;

  @IsString({ message: ' Not found title' })
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  content?: string;

  @IsString()
  @ApiProperty({
    enum: EPostStatus,
    enumName: 'EPostStatus',
    required: false,
    example: EPostStatus.PUBLISHED,
  })
  @IsOptional()
  status?: EPostStatus;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  source?: string;

  @IsBoolean()
  @ApiProperty({
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  hot?: boolean;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  publishDate?: string;

  @IsBoolean()
  @ApiProperty({
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  canComment?: boolean;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  mediaId?: string;

  @IsArray()
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value, 'string'))
  categoryIds?: string[];

  @IsArray()
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformArray(value, 'string'))
  relatedIds?: string[];

  @IsObject()
  @ApiProperty({
    type: () => PartialType(SeoMetaDto),
    required: false,
  })
  @IsOptional()
  seoMeta?: Partial<ISeoMeta>;
}

export class PostUpdateDto
  extends PostCreateDto
  implements Omit<IPostUpdate, 'id'> {}
