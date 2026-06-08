import { ApiProperty } from '@nestjs/swagger';
import { type IPostSummary } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PostSummaryDto implements IPostSummary {
  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  total: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  published: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  pending: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  draft: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  scheduled: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  trash: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: true,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  hot: number;
}
