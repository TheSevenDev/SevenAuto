import { Prisma } from '@prisma/client';
import { type IPostRevisionFindMany } from '@seven-auto/libs';
import { FindManyDto } from 'src/dto/utils.dto';
import { OrderByQuery } from 'src/transform/transform-order-by';

export class PostRevisionFindManyDto
  extends FindManyDto
  implements IPostRevisionFindMany
{
  id?: string;

  @OrderByQuery()
  orderBy?: Prisma.PostMetaOrderByWithAggregationInput;
}
