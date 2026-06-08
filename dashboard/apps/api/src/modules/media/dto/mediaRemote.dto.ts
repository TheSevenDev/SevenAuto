import { ApiProperty } from '@nestjs/swagger';
import { IMediaSaveRemote } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class MediaSaveRemoteDto implements IMediaSaveRemote {
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
  alt?: string;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  width?: number;

  @IsNumber()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  height?: number;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  ext?: string;

  @IsNumber()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  size?: number;

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
    required: true,
  })
  url: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  raw?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  medium?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  small?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  tiny?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  large?: string;
}
