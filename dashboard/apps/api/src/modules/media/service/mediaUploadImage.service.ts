import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EMediaSource, Prisma } from '@prisma/client';
import {
  EMediaType,
  hasPermission,
  IMedia,
  IUser,
  permissions,
  removeNullObject,
} from '@seven-auto/libs';
import * as CryptoJS from 'crypto-js';
import * as path from 'path';
import { MediaLibService } from 'src/libs/media.lib';
import { EnvService } from 'src/modules/env/env.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { MediaUpdateDto } from '../dto/mediaUpdate.dto';
import { IMediaInput } from '../interface/mediaUploadImage.interface';
import { MediaUploadData, MediaUploadFromUrlDto } from '../media.dto';
import { MediaHelperService } from '../media.helper';
import { MediaUpdateService } from './mediaUpdate.service';

const SERVICE_NAME = 'MediaService';

@Injectable()
export class MediaUploadImageService {
  constructor(
    private readonly mediaLibService: MediaLibService,
    private readonly logger: LoggerService,
    private readonly mediaUpdateService: MediaUpdateService,
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
    private readonly mediaHelper: MediaHelperService,
  ) {}

  async getImageFromUrl(url: string): Promise<{
    mimetype: string;
    size: number;
    originalname: string;
    buffer: Buffer;
  }> {
    return this.mediaLibService.getImageFromUrl(url);
  }

  async uploadImageFromUrl(
    args: MediaUploadFromUrlDto,
    currentUser: IUser,
    isServer = false,
    prefix = '',
  ): Promise<IMedia> {
    try {
      const file = (await this.mediaLibService.getImageFromUrl(
        args.url,
      )) as Express.Multer.File;
      if (!file?.mimetype) return null;
      return this.uploadImage({
        data: { ...args, file: file as Express.Multer.File, signature: '' },
        currentUser,
        isServer,
        prefix,
      });
    } catch {
      return null;
    }
  }

  async uploadImage({
    data,
    currentUser,
    isServer = false,
    prefix = '',
    isThrowError = true,
  }: {
    data: MediaUploadData;
    currentUser: IUser;
    isServer?: boolean;
    prefix?: string;
    isThrowError?: boolean;
  }): Promise<IMedia> {
    const { file, signature } = data;
    let { key } = data;
    try {
      if (!file) {
        if (isThrowError) {
          throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
        }
        return null;
      }
      if (!this.validSignature(key, signature) && !isServer) {
        throw new HttpException('Signature invalid', HttpStatus.BAD_REQUEST);
      }

      if (!key) key = file.originalname;

      const { ext, name } = path.parse(key);

      const type = this.mediaHelper.getMediaType(file.mimetype, key);

      if (!this.env.MEDIA_ALLOWED_FILE && type === EMediaType.FILE) {
        throw new BadRequestException('File type is not allowed');
      }

      if (!this.env.MEDIA_ALLOWED_VIDEO && type === EMediaType.VIDEO) {
        throw new BadRequestException('Video type is not allowed');
      }

      if (!prefix) prefix = this.mediaHelper.getUploadPrefix(type);

      let mediaResult;
      if (type === EMediaType.IMAGE) {
        mediaResult = await this.mediaLibService.uploadImage({
          file,
          filename: key,
          prefix,
        });
      } else {
        mediaResult = await this.mediaLibService.uploadFile({
          file,
          filename: key,
          prefix,
        });
      }

      if (!mediaResult) return null;
      const {
        width,
        height,
        size,
        hash,
        url,
        urlLarge,
        urlMedium,
        urlRaw,
        urlSmall,
        urlTiny,
        alt,
      } = mediaResult;

      const dataMedia: Prisma.MediaCreateInput = {
        title: file?.originalname || name,
        alt,
        ext,
        width,
        height,
        size,
        hash,
        url,
        urlLarge,
        urlMedium,
        urlRaw,
        urlSmall,
        urlTiny,
        source: EMediaSource.LOCAL,
        type,
        ...(currentUser
          ? { createdBy: { connect: { id: currentUser.id } } }
          : {}),
      };

      const media = await this.mediaUpdateService.update(
        dataMedia as IMediaInput,
      );

      if (!media) return null;
      return media;
    } catch (error) {
      if (isThrowError) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      await this.logger.error(
        JSON.stringify(
          error instanceof Error ? error.message : 'Unknown error',
        ),
        SERVICE_NAME + '_uploadImage',
      );
    }
  }

  async uploadImageBase64(_image: string, currentUser: IUser): Promise<IMedia> {
    return this.uploadImage({
      data: {
        file: { originalname: 'base64-upload' } as Express.Multer.File,
        key: '',
        signature: '',
      },
      currentUser,
      isServer: true,
    });
  }

  async updateMedia(
    {
      id,
      file,
      title,
      hash,
      alt,
    }: MediaUpdateDto & { id: string; file?: Express.Multer.File },
    currentUser: IUser,
  ): Promise<IMedia> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!hasPermission(currentUser, [permissions.MEDIA_MANAGE])) {
      if (currentUser.id !== media?.createdById) {
        throw new BadRequestException('Permission denied');
      }
    }
    if (!media) throw new BadRequestException('Media not found');
    title = title || '';
    alt = alt || '';
    hash = hash || '';

    const dataMedia: Prisma.MediaCreateInput = removeNullObject({
      id: media.id,
      type: media.type,
      title,
      alt,
      hash,
    });

    if (file) {
      await this.deleteAllImageInMedia(media);
      const key = file.originalname;
      title = key;
      const type = this.mediaHelper.getMediaType(file.mimetype, key);
      const prefix = this.mediaHelper.getUploadPrefix(type);
      let mediaResult;
      if (type === EMediaType.IMAGE) {
        mediaResult = await this.mediaLibService.uploadImage({
          file,
          filename: key,
          prefix,
        });
      } else {
        mediaResult = await this.mediaLibService.uploadFile({
          file,
          filename: key,
          prefix,
        });
      }

      // Check using content
      if (!mediaResult) return null;

      const {
        width,
        height,
        size,
        ext,
        url,
        urlLarge,
        urlMedium,
        urlRaw,
        urlSmall,
        urlTiny,
      } = mediaResult;
      alt = mediaResult.alt;
      hash = mediaResult.hash;

      Object.assign(dataMedia, {
        ext,
        width,
        height,
        size,
        hash,
        url,
        urlLarge,
        urlMedium,
        urlRaw,
        urlSmall,
        urlTiny,
        type,
        source: EMediaSource.LOCAL,
      });
      if (media.url) await this.replaceMediaContent(media.url, dataMedia.url);
      if (media.urlLarge)
        await this.replaceMediaContent(
          media.urlLarge,
          dataMedia.urlLarge || media.url,
        );
      if (media.urlMedium)
        await this.replaceMediaContent(
          media.urlMedium,
          dataMedia.urlMedium || media.url,
        );
      if (media.urlRaw)
        await this.replaceMediaContent(
          media.urlRaw,
          dataMedia.urlRaw || media.url,
        );
      if (media.urlSmall)
        await this.replaceMediaContent(
          media.urlSmall,
          dataMedia.urlSmall || media.url,
        );

      if (media.urlTiny)
        await this.replaceMediaContent(
          media.urlTiny,
          dataMedia.urlTiny || media.url,
        );
    }

    // Replace media content

    const mediaUpdate = await this.mediaUpdateService.update(
      dataMedia as IMediaInput,
    );

    if (!mediaUpdate)
      throw new HttpException(
        'Update media unsuccessful',
        HttpStatus.BAD_REQUEST,
      );

    return { ...mediaUpdate, title, alt };
  }

  async delete(id: string, currentUser: IUser): Promise<IMedia> {
    try {
      const media: IMedia = await this.prisma.media.findUnique({
        where: { id },
        select: {
          id: true,
          url: true,
          urlLarge: true,
          urlMedium: true,
          urlRaw: true,
          urlSmall: true,
          urlTiny: true,
          usersAvatar: { select: { id: true } },
          createdBy: { select: { id: true, createdAt: true, updatedAt: true } },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!media) throw new BadRequestException('Media not found');

      const isPermission = hasPermission(currentUser, [
        permissions.MEDIA_MANAGE,
      ]);

      if (!isPermission && media.createdBy?.id !== currentUser.id) {
        throw new BadRequestException('This media is not owned by you');
      }

      // if (media.categoryIcon && media.categoryIcon.length > 0) {
      //   throw new BadRequestException('Media is using in category icon');
      // }

      // if (media.categoryImage && media.categoryImage.length > 0) {
      //   throw new BadRequestException('Media is using in category image');
      // }

      // if (media.categorySeoImage && media.categorySeoImage.length > 0) {
      //   throw new BadRequestException('Media is using in category seo image');
      // }

      // if (media.hashtagIcon && media.hashtagIcon.length > 0) {
      //   throw new BadRequestException('Media is using in hashtag icon');
      // }

      // if (media.hashtagImage && media.hashtagImage.length > 0) {
      //   throw new BadRequestException('Media is using in hashtag image');
      // }

      // if (media.hashtagSeoImage && media.hashtagSeoImage.length > 0) {
      //   throw new BadRequestException('Media is using in hashtag seo image');
      // }

      // if (media.postImage && media.postImage.length > 0) {
      //   throw new BadRequestException('Media is using in post image');
      // }

      // if (media.postSeoImage && media.postSeoImage.length > 0) {
      //   throw new BadRequestException('Media is using in post seo image');
      // }

      // if (media.userAvatar && media.userAvatar.length > 0) {
      //   throw new BadRequestException('Media is using in user avatar');
      // }

      // Check using content
      // const usingContent = await this.checkMediaUsingContent(media);
      // if (usingContent) {
      //   throw new BadRequestException(usingContent);
      // }

      await this.deleteAllImageInMedia({
        url: media.url,
        urlRaw: media.urlRaw,
        urlLarge: media.urlLarge,
        urlMedium: media.urlMedium,
        urlSmall: media.urlSmall,
        urlTiny: media.urlTiny,
      });
      await this.prisma.media.delete({ where: { id } });
      return media;
    } catch (err) {
      await this.logger.error(
        err instanceof Error ? err.message : 'Unknown error',
        `${SERVICE_NAME}-delete`,
      );
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Unknown error',
      );
    }
  }

  async deleteMany(ids: string[], currentUser: IUser): Promise<IMedia[]> {
    const medias = await this.prisma.media.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        url: true,
        urlLarge: true,
        urlMedium: true,
        urlRaw: true,
        urlSmall: true,
        usersAvatar: { select: { id: true } },
        createdBy: { select: { id: true, createdAt: true, updatedAt: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    const isPermission = hasPermission(currentUser, [permissions.MEDIA_MANAGE]);

    // check owner all media
    for (let index = 0; index < medias.length; index++) {
      const media = medias[index];
      if (!isPermission && media.createdBy?.id !== currentUser.id) {
        throw new BadRequestException('This media is not owned by you');
      }
    }

    const promise = medias.map(async (media) => {
      await this.delete(media.id, currentUser);
      return media;
    });

    return Promise.all(promise);
  }

  validSignature(key: string, signature: string): boolean {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (signature === process.env.GENERAL_KEY) return true;
    const signatureCreate = CryptoJS.HmacSHA256(
      key,
      this.env.MEDIA_SECRET,
    ).toString();
    if (signatureCreate !== signature) return false;
    return true;
  }

  async deleteAllImageInMedia(media: {
    url: string;
    urlRaw: string;
    urlLarge: string;
    urlMedium: string;
    urlSmall: string;
    urlTiny: string;
  }): Promise<boolean> {
    try {
      if (media.url)
        await this.mediaLibService.deleteStorage({ key: media.url });
      if (media.urlRaw)
        await this.mediaLibService.deleteStorage({ key: media.urlRaw });
      if (media.urlLarge)
        await this.mediaLibService.deleteStorage({ key: media.urlLarge });
      if (media.urlMedium)
        await this.mediaLibService.deleteStorage({ key: media.urlMedium });
      if (media.urlSmall)
        await this.mediaLibService.deleteStorage({ key: media.urlSmall });
      if (media.urlTiny)
        await this.mediaLibService.deleteStorage({ key: media.urlTiny });
      return true;
    } catch (error) {
      await this.logger.error(
        error instanceof Error ? error.message : 'Unknown error',
        `${SERVICE_NAME}-deleteAllImageInMedia`,
      );
      return false;
    }
  }

  async replaceMediaContent(url: string, newUrl: string) {
    console.log('replaceMediaContent ~ url, newUrl', url, newUrl);
  }

  async deleteAllMediaNotUse(): Promise<IMedia[]> {
    const medias = await this.prisma.media.findMany({
      where: {
        id: '1',
      },
    });

    const result = [];
    for (let index = 0; index < medias.length; index++) {
      const item = medias[index];
      const usingContent = await this.checkMediaUsingContent(item);
      if (!usingContent) {
        result.push(item);
        await this.deleteAllImageInMedia(item);
        await this.prisma.media.delete({ where: { id: item.id } });
      }
    }

    return result;
  }

  async checkMediaUsingContent(media: IMedia): Promise<string> {
    // Check using content
    const OR = [];
    if (media.url) OR.push({ content: { contains: media.url } });
    if (media.urlLarge) OR.push({ content: { contains: media.urlLarge } });
    if (media.urlMedium) OR.push({ content: { contains: media.urlMedium } });
    if (media.urlRaw) OR.push({ content: { contains: media.urlRaw } });
    if (media.urlSmall) OR.push({ content: { contains: media.urlSmall } });
    if (media.urlTiny) OR.push({ content: { contains: media.urlTiny } });

    if (OR.length > 0) {
      return 'Media is using in content';
    }
    return '';
  }
}
