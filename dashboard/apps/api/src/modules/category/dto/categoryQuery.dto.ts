import { ApiProperty } from '@nestjs/swagger';
import { EStatus, Prisma } from '@prisma/client';
import { ICategoryFindMany, ICategoryFindManyPost } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { FindManyDto } from 'src/dto/utils.dto';
import { transformBoolean } from 'src/transform/transform.boolean';
import { OrderByQuery } from 'src/transform/transform-order-by';

export class CategoryFindManyDto
  extends FindManyDto
  implements ICategoryFindMany
{
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: 'boolean',
    example: false,
    required: false,
  })
  @Transform(({ value }) => transformBoolean(value))
  isSort?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: EStatus.ACTIVE,
    required: false,
  })
  status?: EStatus = EStatus.ACTIVE;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: 'boolean',
    example: false,
    required: false,
  })
  @Transform(({ value }) => transformBoolean(value))
  deleted?: boolean = false;

  @OrderByQuery()
  orderBy?: Prisma.CategoryOrderByWithAggregationInput;
}

export class CategoryFindManyPostDto
  extends FindManyDto
  implements ICategoryFindManyPost
{
  @OrderByQuery()
  orderBy?: Prisma.PostOrderByWithAggregationInput;
}
