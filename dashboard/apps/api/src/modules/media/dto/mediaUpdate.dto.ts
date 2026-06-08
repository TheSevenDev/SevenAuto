import { ApiProperty } from '@nestjs/swagger';
import { IMediaUpdate } from '@seven-auto/libs';
import { IsOptional, IsString } from 'class-validator';

export class MediaUpdateDto implements Omit<IMediaUpdate, 'file' | 'id'> {
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
  hash?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  alt?: string;
}
