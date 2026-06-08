import { ApiProperty } from '@nestjs/swagger';
import { ISeoMeta } from '@seven-auto/libs';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { MediaDto } from 'src/modules/media/dto/media.dto';

import { BaseEntityDto } from './utils.dto';

export class SeoMetaDto extends BaseEntityDto implements ISeoMeta {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  keywords?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  mediaId?: string;

  @ApiProperty({
    type: () => MediaDto,
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  media?: MediaDto;
}
