import { forwardRef, Module } from '@nestjs/common';
import { MediaLibService } from 'src/libs/media.lib';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LoggerModule } from 'src/modules/logger/logger.module';

import { MediaController } from './media.controller';
import { MediaHelperService } from './media.helper';
import { MediaQueryService } from './service/mediaQuery.service';
import { MediaUpdateService } from './service/mediaUpdate.service';
import { MediaUploadImageService } from './service/mediaUploadImage.service';

@Module({
  imports: [forwardRef(() => AuthModule), LoggerModule],
  controllers: [MediaController],
  providers: [
    MediaUploadImageService,
    MediaUpdateService,
    MediaQueryService,
    MediaLibService,
    MediaHelperService,
  ],
  exports: [
    MediaUploadImageService,
    MediaUpdateService,
    MediaQueryService,
    MediaHelperService,
  ],
})
export class MediaModule {}
