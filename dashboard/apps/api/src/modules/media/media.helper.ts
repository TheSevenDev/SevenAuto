import { Injectable } from '@nestjs/common';
import { EMediaType } from '@prisma/client';
import { format } from 'date-fns';
import { imageMimetypes, videoMimetypes } from 'src/libs/media.lib';
import { EnvService } from 'src/modules/env/env.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

const SERVICE_NAME = 'MediaHelperService';

@Injectable()
export class MediaHelperService {
  public monthYear = format(new Date(), 'yyyy-MM');

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly env: EnvService,
  ) {}

  getMediaType(mimetype: string, name?: string): EMediaType {
    try {
      const mimetypes = mimetype.toLowerCase();

      if (mimetypes === 'application/octet-stream') {
        switch (name?.split('.').pop()?.toLowerCase()) {
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'gif':
          case 'webp':
            return EMediaType.IMAGE;
          case 'mp4':
          case 'webm':
          case 'ogg':
          case 'mov':
          case 'avi':
          case 'flv':
          case 'wmv':
          case 'mkv':
            return EMediaType.VIDEO;
          default:
            return EMediaType.FILE;
        }
      }
      if (imageMimetypes.includes(mimetypes)) {
        return EMediaType.IMAGE;
      } else if (videoMimetypes.includes(mimetypes)) {
        return EMediaType.VIDEO;
      } else return EMediaType.FILE;
    } catch (error: unknown) {
      this.logger.error(
        error instanceof Error ? error.message : 'Unknown error',
        `${SERVICE_NAME}-getMediaType`,
      );
      return EMediaType.FILE;
    }
  }

  getUploadPrefix(type: EMediaType): string {
    try {
      let prefix = this.env.MEDIA_UPLOAD_PREFIX;
      prefix += `/${type.toLowerCase()}s/${this.monthYear}`;
      if (prefix.startsWith('/')) prefix = prefix.slice(1);
      return prefix;
    } catch (error: unknown) {
      this.logger.error(
        error instanceof Error ? error.message : 'Unknown error',
        `${SERVICE_NAME}-getUploadPrefix`,
      );
      return '';
    }
  }
}
