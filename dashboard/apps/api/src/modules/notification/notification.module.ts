import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';

import { EmailModule } from '../email/email.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationController } from './notification.controller';
import { NotificationHelper } from './notification.helper';
import { NotificationService } from './notification.service';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    RoleModule,
    WebsocketModule,
    forwardRef(() => EmailModule),
    forwardRef(() => UserModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationHelper],
  exports: [NotificationService, NotificationHelper],
})
export class NotificationModule {}
