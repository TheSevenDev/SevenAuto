import { ApiProperty } from '@nestjs/swagger';
import { type IPostMeta } from '@seven-auto/libs';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from 'src/dto/utils.dto';

import { PostDto } from './post.dto';

export class PostMetaDto extends BaseEntityDto implements IPostMeta {
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  postId?: string;

  @ApiProperty({
    type: () => PostDto,
    required: false,
  })
  @IsOptional()
  post?: PostDto;
}
