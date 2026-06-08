import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EMediaSource, Prisma } from '@prisma/client';
import { EMediaType, IMedia, removeNullObject } from '@seven-auto/libs';
import { PrismaService } from 'src/prisma/prisma.service';

import { MediaSaveRemoteDto } from '../dto/mediaRemote.dto';
import { IMediaInput } from '../interface/mediaUploadImage.interface';
import { mediaSelect } from '../media.select';
import { MediaQueryService } from './mediaQuery.service';

@Injectable()
export class MediaUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaQueryService: MediaQueryService,
  ) {}
  async update({
    id,
    title,
    alt,
    ext,
    width,
    height,
    size,
    hash,
    url,
    source,
    urlLarge,
    urlMedium,
    urlSmall,
    urlTiny,
    urlRaw,
    createdBy,
    type = EMediaType.IMAGE,
  }: IMediaInput): Promise<IMedia> {
    const data = removeNullObject({
      title,
      alt,
      ext,
      width,
      height,
      size,
      hash,
      url,
      source,
      urlLarge,
      urlMedium,
      urlSmall,
      urlTiny,
      urlRaw,
      type,
      createdBy,
    });
    try {
      const prismaMedia = await this.prisma.media.upsert({
        where: { id: id || '' },
        update: data as Prisma.MediaUpdateInput,
        create: { ...(data as Prisma.MediaCreateInput) },
        select: mediaSelect.basic,
      });
      if (!prismaMedia) {
        throw new BadRequestException('Media not found');
      }
      return this.mediaQueryService.parseMedia(prismaMedia);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async saveImageRemote(args: MediaSaveRemoteDto): Promise<IMedia> {
    try {
      const findImage = await this.prisma.media.findFirst({
        where: { url: args.url },
      });

      if (findImage) return findImage;

      return this.prisma.media.create({
        data: {
          title: args.title,
          alt: args.alt,
          ext: args.ext,
          width: args.width,
          height: args.height,
          size: args.size,
          hash: args.hash,
          url: args.url,
          urlRaw: args.raw,
          urlMedium: args.medium,
          urlSmall: args.small,
          urlTiny: args.tiny,
          urlLarge: args.large,
          source: EMediaSource.REMOTE,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateByField({ data, field, id }): Promise<Record<string, unknown>> {
    try {
      if (!id) {
        data[field] = null;
        return data;
      }

      const media = await this.prisma.media.findMany({
        where: { id },
      });
      if (!media) throw new BadRequestException('Media not found');

      data[field] = id;
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
