import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { NotificationModule } from '../notification/notification.module';
import { PostController } from './post.controller';
import { PostHelperService } from './post.helper';
import { PostService } from './post.service';
import { PostRevisionController } from './post-revision.controller';
import { PostActionService } from './service/postAction.service';
import { PostRevisionService } from './service/postRevision.service';
@Module({
  imports: [MediaModule, AuthModule, NotificationModule],
  controllers: [PostController, PostRevisionController],
  providers: [
    PostService,
    PostActionService,
    PostRevisionService,
    PostHelperService,
  ],
  exports: [
    PostService,
    PostHelperService,
    PostActionService,
    PostRevisionService,
  ],
})
export class PostModule {}
