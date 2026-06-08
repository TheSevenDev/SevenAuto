import { ApiProperty } from '@nestjs/swagger';
import { EPostStatus, Prisma } from '@prisma/client';
import { type IPostFindMany } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { FindManyDto } from 'src/dto/utils.dto';
import { QueryArrayParam } from 'src/transform/query-array.decorator';
import { transformBoolean } from 'src/transform/transform.boolean';
import { OrderByQuery } from 'src/transform/transform-order-by';

export class PostFindManyDto extends FindManyDto implements IPostFindMany {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'number', required: false })
  status?: EPostStatus;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: false, required: false })
  @Transform(({ value }) => transformBoolean(value))
  deleted?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', example: false, required: false })
  @Transform(({ value }) => transformBoolean(value))
  hot?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  authorId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  authName?: string;

  @QueryArrayParam('string')
  @ApiProperty({ type: 'string', required: false, isArray: true })
  categories?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false })
  @Transform(({ value }) => transformBoolean(value))
  featured?: boolean;

  @OrderByQuery({ publishDate: 'desc' })
  orderBy?: Prisma.PostOrderByWithAggregationInput;
}
