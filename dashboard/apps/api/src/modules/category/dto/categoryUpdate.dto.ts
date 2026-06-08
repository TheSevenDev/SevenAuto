import { ICategoryUpdate } from '@seven-auto/libs';

import { CategoryCreateDto } from './categoryCreate.dto';

export class CategoryUpdateDto
  extends CategoryCreateDto
  implements Omit<ICategoryUpdate, 'id'> {}
