import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  IMedia,
  type IPostMetaUpdatePost,
  removeEmptyArray,
} from '@seven-auto/libs';
// import { Cache } from 'cache-manager';
import CryptoJS from 'crypto-js';
import * as dateFns from 'date-fns';
import slugify from 'slugify';
import { LoggerService } from 'src/modules/logger/logger.service';
import { MediaUploadImageService } from 'src/modules/media/service/mediaUploadImage.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { postMetaKey } from './post.const';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

const CLS_SERVICE = 'PostHelperService';
const META_LENGTH_LIMIT_UPDATE = 500;
const META_TIME_LIMIT_UPDATE = 60;

@Injectable()
export class PostHelperService {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly mediaUploadImageService: MediaUploadImageService,
  ) {}

  async generateSlugByTitle(slug: string, title: string): Promise<string> {
    try {
      if (!slug) slug = title;
      slug = slugify(slug, { lower: true, strict: true });
      // const exits = await this.prisma.post.findUnique({
      //   where: { slug },
      // });
      // if (exits && exits.id) {
      //   slug = `${slug}-${new Date().getTime()}`;
      // }
      slug = `${slug}-${new Date().getTime()}`;
      return slug;
    } catch (error) {
      await this.logger.error(JSON.stringify(error), CLS_SERVICE);
      return slug;
    }
  }

  async checkCategories({
    categoryIds,
  }: {
    categoryIds: string[];
  }): Promise<string[]> {
    try {
      const promise = categoryIds.map(async (item) => {
        try {
          const category = await this.prisma.category.findUnique({
            where: { id: item },
            select: { id: true },
          });
          if (category) return category.id;
          return null;
        } catch {
          return null;
        }
      });
      const result = await Promise.all(promise);
      return removeEmptyArray(result);
    } catch (error) {
      await this.logger.error(JSON.stringify(error), CLS_SERVICE);
      throw new HttpException(error, 500);
    }
  }

  async updateCategories({
    id,
    categoryIds,
  }: {
    id: string;
    categoryIds: string[];
  }): Promise<void> {
    await this.prisma.postCategory.deleteMany({
      where: { postId: id },
    });
    categoryIds = await this.checkCategories({ categoryIds });
    if (categoryIds.length > 0) {
      await this.prisma.postCategory.createMany({
        data: [
          ...categoryIds.map((item, index) => ({
            postId: id,
            categoryId: item,
            sort: index + 1,
          })),
        ],
        skipDuplicates: false,
      });
    }
  }

  async checkCreateCategories({
    categories,
  }: {
    categories: {
      slug?: string;
      title: string;
      description?: string;
      image?: IMedia;
    }[];
  }) {
    try {
      const promise = categories.map(async (item) => {
        try {
          if (!item) return null;
          if (!item.title || !item.slug) return null;
          const category = await this.prisma.category.findFirst({
            where: {
              OR: [{ title: item.title }, { slug: item.slug }],
            },
            select: { id: true },
          });
          if (category) return category.id;

          const data: Prisma.CategoryCreateInput = {
            title: item.title,
            slug: item.slug,
            description: item.description,
          };
          //update Image
          if (item.image && item.image.url) {
            const media = await this.mediaUploadImageService.uploadImageFromUrl(
              {
                url: item.image.url,
                alt: item.image.alt,
              },
              null,
              true,
            );
            if (media) {
              data.mediaIcon = { connect: { id: media.id } };
              data.mediaImage = { connect: { id: media.id } };
            }
          }
          const newCategory = await this.prisma.category.create({ data });
          return newCategory.id;
        } catch {
          return null;
        }
      });
      const result = await Promise.all(promise);
      return removeEmptyArray(result);
    } catch (error) {
      await this.logger.error(JSON.stringify(error), CLS_SERVICE);
      throw new HttpException(error, 500);
    }
  }

  async checkRelated({
    relatedIds,
  }: {
    relatedIds: string[];
  }): Promise<string[]> {
    try {
      const promise = relatedIds.map(async (item) => {
        try {
          const related = await this.prisma.post.findUnique({
            where: { id: item },
            select: { id: true },
          });
          if (related) return related.id;
          return null;
        } catch {
          return null;
        }
      });
      const result = await Promise.all(promise);
      return removeEmptyArray(result);
    } catch (error) {
      await this.logger.error(JSON.stringify(error), CLS_SERVICE);
      throw new HttpException(error, 500);
    }
  }

  async updateRelated({
    id,
    relatedIds,
  }: {
    id: string;
    relatedIds: string[];
  }): Promise<void> {
    await this.prisma.postRelated.deleteMany({
      where: { postId: id },
    });
    relatedIds = await this.checkRelated({ relatedIds });
    if (relatedIds.length > 0) {
      await this.prisma.postRelated.createMany({
        data: [
          ...relatedIds.map((item, index) => ({
            sort: index + 1,
            postId: id,
            postRelatedId: item,
          })),
        ],
        skipDuplicates: false,
      });
    }
  }

  async updateMetaContent({ post }) {
    try {
      const meta = await this.prisma.postMeta.findFirst({
        where: {
          postId: post.id,
          key: postMetaKey.POST_KEY_UPDATE,
        },
        select: {
          id: true,
          value: true,
          postId: true,
          updatedAt: true,
          createdAt: true,
          post: { select: { id: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const valueMeta: IPostMetaUpdatePost = {
        postId: post.id,
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
      };

      if (meta) {
        let lengthContentDiff = 0;
        if (JSON.parse(meta.value)) {
          lengthContentDiff =
            valueMeta.content?.length -
              JSON.parse(meta.value).content?.length || 0;
        }
        const diff = dateFns.differenceInSeconds(new Date(), meta.updatedAt);
        if (
          (diff > META_TIME_LIMIT_UPDATE &&
            lengthContentDiff !== META_LENGTH_LIMIT_UPDATE) ||
          lengthContentDiff > META_LENGTH_LIMIT_UPDATE
        )
          return this.createPostMeta(
            JSON.stringify(valueMeta),
            postMetaKey.POST_KEY_UPDATE,
            valueMeta.postId,
          );
      } else
        return this.createPostMeta(
          JSON.stringify(valueMeta),
          postMetaKey.POST_KEY_UPDATE,
          valueMeta.postId,
        );
    } catch (error) {
      console.log('post.helper.ts:256 ~ updateMetaContent ~ error:', error);
    }
  }

  async createPostMeta(valueMeta: string, key: string, postId: string) {
    try {
      const meta = await this.prisma.postMeta.create({
        data: {
          key,
          value: valueMeta,
          post: { connect: { id: postId } },
        },
      });
      return meta;
    } catch {
      await this.logger.error(
        JSON.stringify(valueMeta),
        `${CLS_SERVICE}:createPostMeta`,
      );
    }
  }

  async clearCache(slug: string): Promise<void> {
    //clear cache
    try {
      const dataCache = {
        url: `/api/post/slug/${slug}`,
        method: 'GET',
        params: { slug },
        query: {},
        body: {},
      };
      const key = CryptoJS.HmacSHA256(
        JSON.stringify(dataCache),
        'x',
      ).toString();
      // TODO: clear cache
      console.log('file: post.helper.ts:291 ~ clearCache ~ key:', key);
      // await this.cacheManager.del(key);
    } catch {
      // cache clear is best-effort
    }
  }
}
