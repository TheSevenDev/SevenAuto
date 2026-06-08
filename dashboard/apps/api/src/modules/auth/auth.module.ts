import { forwardRef, Module } from '@nestjs/common';
import { EmailModule } from 'src/modules/email/email.module';
import { MediaModule } from 'src/modules/media/media.module';
import { UserModule } from 'src/modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthHelperService } from './auth.helper';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelperService],
  exports: [AuthService, AuthHelperService],
})
export class AuthModule {}
