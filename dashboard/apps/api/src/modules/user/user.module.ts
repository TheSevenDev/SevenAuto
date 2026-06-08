import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MediaModule } from 'src/modules/media/media.module';

import { NotificationModule } from '../notification/notification.module';
import { UserActionService } from './service/userAction.service';
import { UserQueryService } from './service/userQuery.service';
import { UserController } from './user.controller';
import { UserHelper } from './user.helper';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MediaModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [UserController],
  providers: [UserActionService, UserQueryService, UserHelper],
  exports: [UserActionService, UserQueryService, UserHelper],
})
export class UserModule {}
