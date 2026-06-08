import { Module } from '@nestjs/common';
import { MediaModule } from 'src/modules/media/media.module';

import { PostModule } from '../post/post.module';
import { CategoryController } from './category.controller';
import { CategoryCreateService } from './service/categoryCreate.service';
import { CategoryDeleteService } from './service/categoryDelete.service';
import { CategoryQueryService } from './service/categoryQuery.service';
import { CategoryUpdateService } from './service/categoryUpdate.service';

@Module({
  imports: [MediaModule, PostModule],
  controllers: [CategoryController],
  providers: [
    CategoryCreateService,
    CategoryQueryService,
    CategoryUpdateService,
    CategoryDeleteService,
  ],
  exports: [
    CategoryCreateService,
    CategoryQueryService,
    CategoryUpdateService,
    CategoryDeleteService,
  ],
})
export class CategoryModule {}
