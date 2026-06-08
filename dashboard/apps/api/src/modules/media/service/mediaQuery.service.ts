import { BadRequestException, Injectable } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import {
  EMediaType,
  hasPermission,
  IFindManyResponse,
  IMedia,
  IUser,
  permissions,
} from '@seven-auto/libs';
import { EnvService } from 'src/modules/env/env.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { MediaFindManyDto } from '../dto/mediaQuery.dto';
import { mediaSelect } from '../media.select';

const SERVICE_NAME = 'MediaQueryService';

@Injectable()
export class MediaQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly env: EnvService,
  ) {}

  async findOneById(id: string): Promise<IMedia> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          alt: true,
          ext: true,
          hash: true,
          width: true,
          height: true,
          size: true,
          url: true,
          urlRaw: true,
          urlLarge: true,
          urlMedium: true,
          urlSmall: true,
          urlTiny: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              fullname: true,
              username: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          type: true,
          source: true,
          usersAvatar: {
            select: {
              id: true,
              fullname: true,
              username: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      return media;
    } catch (err: unknown) {
      if (err instanceof Error) {
        await this.logger.error(err.message, `${SERVICE_NAME}-findOneById`);
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findMany(
    {
      take,
      skip,
      filter,
      orderBy,
      types,
      source,
      ext,
      size_gte,
      size_lte,
      createdAt_gte,
      createdAt_lte,
      updatedAt_gte,
      updatedAt_lte,
      createdById,
    }: MediaFindManyDto,
    currentUser: IUser,
  ): Promise<IFindManyResponse<IMedia>> {
    try {
      const isPermission = hasPermission(currentUser, [
        permissions.MEDIA_MANAGE,
      ]);

      const where: Prisma.MediaWhereInput = {
        ...(filter && {
          OR: [
            { title: { contains: filter } },
            { alt: { contains: filter } },
            {
              hash: { contains: filter },
            },
          ],
        }),
        ...(types && { type: { in: types } }),
        ...(source && { source }),
        ...(ext && { ext: `.${ext}` }),
        ...(createdById && { createdById }),
      };
      // Size
      if (size_gte && size_lte) {
        where.size = {
          gte: size_gte,
          lte: size_lte,
        };
      } else if (size_gte) {
        where.size = {
          gte: size_gte,
        };
      } else if (size_lte) {
        where.size = {
          lte: size_lte,
        };
      }

      // CreatedAt
      if (createdAt_gte && createdAt_lte) {
        where.createdAt = {
          gte: new Date(createdAt_gte),
          lte: new Date(createdAt_lte),
        };
      } else if (createdAt_gte) {
        where.createdAt = {
          gte: new Date(createdAt_gte),
        };
      } else if (createdAt_lte) {
        where.createdAt = {
          lte: new Date(createdAt_lte),
        };
      }

      // UpdatedAt
      if (updatedAt_gte && updatedAt_lte) {
        where.updatedAt = {
          gte: new Date(updatedAt_gte),
          lte: new Date(updatedAt_lte),
        };
      } else if (updatedAt_gte) {
        where.updatedAt = {
          gte: new Date(updatedAt_gte),
        };
      } else if (updatedAt_lte) {
        where.updatedAt = {
          lte: new Date(updatedAt_lte),
        };
      }

      if (!isPermission) {
        where.createdBy = {
          id: currentUser.id,
        };
      }

      const prismaMedias = await this.prisma.media.findMany({
        where,
        take,
        skip,
        orderBy,
        select: mediaSelect.basic,
      });
      const medias: IMedia[] = prismaMedias.map((media) =>
        this.parseMedia(media),
      );
      const total = await this.prisma.media.count({ where });

      return { items: medias, total };
    } catch (err: unknown) {
      if (err instanceof Error) {
        await this.logger.error(err.message, `${SERVICE_NAME}-findMany`);
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async checkMediaExist(id: string): Promise<boolean> {
    if (!id) return false;

    const media = await this.prisma.media.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!media) return false;
    return true;
  }

  async checkMediaExists(ids: string[]): Promise<boolean> {
    if (!ids || ids.length === 0) return false;

    const medias = await this.prisma.media.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (medias.length !== ids.length) return false;
    return true;
  }

  async getMediaByIds(ids: string[]): Promise<string[]> {
    if (!ids || ids.length === 0) return [];

    const medias = await this.prisma.media.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return medias.map((media) => media.id);
  }

  async getFullUrlByIds(ids: string[]): Promise<string[]> {
    if (!ids || ids.length === 0) return [];

    const medias = await this.prisma.media.findMany({
      where: { id: { in: ids } },
      select: { url: true },
    });

    return medias.map((media) => `${this.env.ASSETS_URL}/${media.url}`);
  }

  convertToIconUrl(url: string): string {
    if (!url) return '';
    if (url.includes(`/${EMediaType.IMAGE.toLowerCase()}s/`)) return url;
    if (url.includes(`/${EMediaType.VIDEO.toLowerCase()}s/`))
      return `${this.env.BASE_URL}/assets/icons/files/ic_video.svg`;
    if (url.includes(`/${EMediaType.FILE.toLowerCase()}s/`))
      return `${this.env.BASE_URL}/assets/icons/files/ic_document.svg`;
    if (url.includes(`/${EMediaType.AUDIO.toLowerCase()}s/`))
      return `${this.env.BASE_URL}/assets/icons/files/ic_audio.svg`;
    return `${this.env.BASE_URL}/assets/icons/files/ic_file.svg`;
  }

  parseMedia(media: Partial<Media>): IMedia {
    return {
      id: media.id || '',
      ...media,
      createdAt: media.createdAt || new Date(),
      updatedAt: media.updatedAt || new Date(),
    };
  }
}
