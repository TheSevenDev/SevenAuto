import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { EMediaSource, EMediaType, IMedia } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from 'src/dto/utils.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export type PrismaMedia = Prisma.MediaGetPayload<{
  include: { _count: true; createdBy: true };
}>;
export class MediaDto extends BaseEntityDto implements IMedia {
  constructor(media: Partial<PrismaMedia>) {
    super();
    Object.assign(this, media);
    this.createdBy = media.createdBy ? new UserDto(media.createdBy) : undefined;
  }

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  ext?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  hash?: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  width?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  height?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  size?: number;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  urlRaw?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  urlLarge?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  urlMedium?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  urlSmall?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  urlTiny?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  createdById?: string;

  @ApiProperty({
    type: () => UserDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  createdBy?: UserDto;

  @ApiProperty({
    enum: EMediaType,
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: EMediaType;

  @ApiProperty({
    enum: EMediaSource,
    required: false,
  })
  @IsOptional()
  @IsString()
  source?: EMediaSource;
}
