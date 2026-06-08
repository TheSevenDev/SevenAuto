import { ApiProperty } from '@nestjs/swagger';
import { EMediaSource, EMediaType, Prisma } from '@prisma/client';
import { IMediaFindMany, IMediaFindOne } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { FindManyDto } from 'src/dto/utils.dto';
import { QueryArrayParam } from 'src/transform/query-array.decorator';
import { transformDate } from 'src/transform/transform.date';
import { OrderByQuery } from 'src/transform/transform-order-by';

export class MediaFindOneDto implements IMediaFindOne {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  @IsOptional()
  id?: string;
}

export class MediaFindManyDto extends FindManyDto implements IMediaFindMany {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  @IsOptional()
  ext?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  @IsOptional()
  source?: EMediaSource;

  @QueryArrayParam('string')
  @ApiProperty({
    type: 'array',
    example: [],
    required: false,
    isArray: true,
    enum: EMediaType,
  })
  types?: EMediaType[];

  @IsInt()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size_gte?: number;

  @IsInt()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size_lte?: number;

  @IsDate()
  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  createdAt_gte?: Date;

  @IsDate()
  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  createdAt_lte?: Date;

  @IsDate()
  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  updatedAt_gte?: Date;

  @IsDate()
  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  updatedAt_lte?: Date;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'createdById',
    required: false,
  })
  @IsOptional()
  createdById?: string;

  @OrderByQuery({ updatedAt: 'desc' })
  orderBy?: Prisma.MediaOrderByWithAggregationInput;
}
