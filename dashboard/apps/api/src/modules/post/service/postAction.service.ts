import { BadRequestException, Injectable } from '@nestjs/common';
import { EPostStatus, Prisma } from '@prisma/client';
import {
  hasPermission,
  IPost,
  IUser,
  permissions,
  removeNullObject,
} from '@seven-auto/libs';
import { postError } from 'src/messages/post.message';
import { MediaUpdateService } from 'src/modules/media/service/mediaUpdate.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { PostCreateDto, PostUpdateDto } from '../dto/postAction.dto';
import { PostHelperService } from '../post.helper';
import { postSelect } from '../post.select';
import { PostService } from '../post.service';

@Injectable()
export class PostActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postHelper: PostHelperService,
    private readonly mediaUpdateService: MediaUpdateService,
    private readonly postService: PostService,
  ) {}

  async create(
    {
      slug,
      title,
      content,
      hot = false,
      description,
      status = EPostStatus.DRAFT,
      canComment = true,
      mediaId,
      categoryIds,
      source,
      publishDate,
      seoMeta,
      relatedIds,
    }: PostCreateDto,
    currentUser?: IUser,
  ): Promise<IPost> {
    if (!title) throw new BadRequestException(postError.title_required);

    slug = await this.postHelper.generateSlugByTitle(slug ?? '', title ?? '');

    publishDate = new Date(publishDate || new Date()).toISOString();

    const data: Prisma.PostCreateInput = {
      slug,
      title,
      description,
      content,
      hot,
      canComment,
      ...(currentUser && { author: { connect: { id: currentUser.id } } }),
      status: status as EPostStatus,
      publishDate,
      ...(source && { source }),
    };

    if (mediaId) {
      const checkExist = await this.prisma.media.findUnique({
        where: { id: mediaId },
      });
      if (checkExist) {
        data.media = { connect: { id: mediaId } };
      }
    }

    if (seoMeta) {
      data.seoMeta = {
        create: {
          ...(seoMeta.title && { title: seoMeta.title }),
          ...(seoMeta.description && { description: seoMeta.description }),
          ...(seoMeta.keywords && { keywords: seoMeta.keywords }),
        },
      };

      if (seoMeta.mediaId) {
        const checkExist = await this.prisma.media.findUnique({
          where: { id: seoMeta.mediaId },
        });
        if (checkExist) {
          data.seoMeta.create.media = { connect: { id: seoMeta.mediaId } };
        }
      }
    }

    const post = await this.prisma.post.create({
      data,
      select: postSelect.basic,
    });

    if (categoryIds && categoryIds.length > 0) {
      categoryIds = await this.postHelper.checkCategories({ categoryIds });
      await this.prisma.postCategory.createMany({
        data: categoryIds.map((item, index) => ({
          categoryId: item,
          postId: post.id,
          sort: index,
        })),
      });
    }

    if (relatedIds && relatedIds.length > 0) {
      await this.postHelper.updateRelated({ id: post.id, relatedIds });
    }

    return this.postService.parsePost(post);
  }

  async update({
    args,
    currentUser,
  }: {
    args: PostUpdateDto & { id: string };
    currentUser: IUser;
  }): Promise<IPost> {
    const isAdmin = hasPermission(currentUser, [permissions.POST_MANAGE]);

    let dataInput: Prisma.PostUpdateInput = removeNullObject({
      title: args.title,
      description: args.description,
      status: args.status,
      content: args.content,
      source: args.source,
      ...(args.publishDate && {
        publishDate: new Date(args.publishDate || ''),
      }),
    });

    if (args.hot !== undefined) dataInput.hot = args.hot;
    if (args.canComment !== undefined) dataInput.canComment = args.canComment;

    const existPost = await this.prisma.post.findFirst({
      where: { id: args.id },
      select: {
        id: true,
        content: true,
        status: true,
        slug: true,
        mediaId: true,
        authorId: true,
        source: true,
        publishDate: true,
      },
    });
    if (!existPost) throw new BadRequestException(postError.not_found);

    const isOwner = currentUser.id === existPost.authorId;
    if (!isOwner && !isAdmin) {
      throw new BadRequestException(postError.does_not_allowed);
    }

    let slug = args.slug;
    if (slug && existPost && slug !== existPost?.slug) {
      slug = await this.postHelper.generateSlugByTitle(slug, args.title ?? '');
      dataInput.slug = slug;
    }

    if (args.categoryIds) {
      await this.postHelper.updateCategories({
        id: args.id,
        categoryIds: args.categoryIds,
      });
    }

    if (args.relatedIds) {
      await this.postHelper.updateRelated({
        id: args.id,
        relatedIds: args.relatedIds,
      });
    }

    if (args.mediaId && args.mediaId !== existPost?.mediaId) {
      dataInput = await this.mediaUpdateService.updateByField({
        data: dataInput,
        field: 'mediaId',
        id: args.mediaId,
      });
    } else if (args.mediaId === '') {
      dataInput.media = { disconnect: true };
    }

    if (args.status && args.status !== existPost.status) {
      if (args.status === EPostStatus.PUBLISHED) {
        dataInput.status = EPostStatus.PUBLISHED;
        dataInput.publishDate = new Date();
      } else {
        dataInput.status = args.status as EPostStatus;
      }
    }

    const update = await this.prisma.post.update({
      where: { id: args.id },
      data: dataInput,
      select: {
        ...postSelect.basic,
        content: true,
      },
    });

    if (update && args.content !== existPost.content) {
      await this.postHelper.updateMetaContent({ post: update });
    }

    if (args.seoMeta) {
      const checkExist = await this.prisma.seoMeta.findFirst({
        where: { postId: args.id },
      });
      const dataSeoMeta: Prisma.SeoMetaUpdateInput = {
        ...(args.seoMeta.title && { title: args.seoMeta.title }),
        ...(args.seoMeta.description && {
          description: args.seoMeta.description,
        }),
        ...(args.seoMeta.keywords && { keywords: args.seoMeta.keywords }),
      };

      if (
        args.seoMeta.mediaId &&
        args.seoMeta.mediaId !== checkExist?.mediaId
      ) {
        const checkExistMedia = await this.prisma.media.findUnique({
          where: { id: args.seoMeta.mediaId },
        });
        if (checkExistMedia) {
          dataSeoMeta.media = { connect: { id: args.seoMeta.mediaId } };
        }
      } else if (args.seoMeta.mediaId === '' && checkExist?.mediaId) {
        dataSeoMeta.media = { disconnect: true };
      }

      if (checkExist) {
        await this.prisma.seoMeta.update({
          where: { id: checkExist.id },
          data: dataSeoMeta,
        });
      } else {
        await this.prisma.seoMeta.create({
          data: {
            ...(dataSeoMeta as Prisma.SeoMetaCreateInput),
            post: { connect: { id: args.id } },
          },
        });
      }
    }

    await this.postHelper.clearCache(existPost.slug);
    return this.postService.parsePost(update);
  }

  async delete(id: string, currentUser: IUser): Promise<IPost> {
    const existPost = await this.prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        slug: true,
        content: true,
        authorId: true,
      },
    });

    if (!existPost) throw new BadRequestException(postError.not_found);
    // check POST_MANAGE right
    if (!hasPermission(currentUser, [permissions.POST_MANAGE])) {
      if (currentUser.id !== existPost.authorId) {
        throw new BadRequestException(postError.does_not_allowed);
      }
    }

    await this.prisma.postCategory.deleteMany({ where: { postId: id } });
    await this.prisma.postRelated.deleteMany({ where: { postId: id } });
    await this.prisma.postMeta.deleteMany({ where: { postId: id } });

    const deletePost = await this.prisma.post.delete({
      where: { id },
      select: postSelect.basic,
    });

    await this.postHelper.clearCache(existPost.slug);

    return this.postService.parsePost(deletePost);
  }
}
