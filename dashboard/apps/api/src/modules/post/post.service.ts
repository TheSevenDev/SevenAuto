import { BadRequestException, Injectable } from '@nestjs/common';
import { EPostStatus, Post, Prisma } from '@prisma/client';
import {
  hasPermission,
  ICategory,
  IFindManyResponse,
  IPost,
  IPostSummary,
  IUser,
  permissions,
} from '@seven-auto/libs';
import { endOfDay, startOfDay } from 'date-fns';
import _ from 'lodash';
import { FindManyDto } from 'src/dto/utils.dto';
import { postError } from 'src/messages/post.message';
import { CategoryBasicSelect } from 'src/modules/category/category.select';
import { PrismaService } from 'src/prisma/prisma.service';

import { PostFindManyDto } from './dto/postQuery.dto';
import { postMetaKey } from './post.const';
import { postSelect } from './post.select';
import { postCheckIsEnable, postCheckReturnContent } from './post.utils';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string, currentUser?: IUser): Promise<IPost> {
    let isPermission = false;
    if (hasPermission(currentUser, [permissions.POST_MANAGE]))
      isPermission = true;

    const select = isPermission ? postSelect.admin : postSelect.full;
    let prismaPost = await this.prisma.post.findUnique({
      where: { id },
      select: {
        ...select,
        content: true,
      },
    });
    if (!prismaPost)
      prismaPost = await this.prisma.post.findUnique({
        where: { slug: id.toString() },
        select,
      });
    if (!prismaPost) return null;

    let result = this.parsePost(prismaPost);
    result = await this.assignCategory(result);
    result = await this.assignRelated(result);
    result = await this.assignAction(result);

    if (currentUser?.id === result.authorId) isPermission = true;
    if (!isPermission) result = postCheckIsEnable(result);
    result = postCheckReturnContent(result);
    if (
      !isPermission &&
      result?.status === EPostStatus.DRAFT &&
      currentUser.id !== result.authorId
    ) {
      throw new BadRequestException(postError.cant_view_draft);
    }

    return result;
  }

  async findOneBySlug(slug: string, currentUser?: IUser): Promise<IPost> {
    let isPermission = false;
    if (hasPermission(currentUser, [permissions.POST_MANAGE]))
      isPermission = true;

    const select = isPermission ? postSelect.admin : postSelect.full;
    const prismaPost = await this.prisma.post.findUnique({
      where: { slug },
      select: {
        ...select,
        content: true,
      },
    });

    if (!prismaPost) return null;
    let post = this.parsePost(prismaPost);
    if (currentUser?.id === post.authorId) isPermission = true;
    if (!isPermission) post = postCheckIsEnable(post);
    post = postCheckReturnContent(post);

    if (!post) return null;

    if (!isPermission) {
      delete post.status;
      delete post.deleted;
    }

    let data = await this.assignCategory(post);
    data = await this.assignRelated(data);
    data = await this.assignAction(data);

    return data;
  }

  async countPost(
    {
      filter,
      startDate,
      endDate,
      status = EPostStatus.PUBLISHED,
      hot,
      authorId,
      authName,
      categories,
      includeIds,
      excludeIds,
      featured,
    }: PostFindManyDto,
    currentUser: IUser,
  ): Promise<number> {
    let isPermission = hasPermission(currentUser, [permissions.POST_MANAGE]);

    if (authorId === currentUser.id) isPermission = true;

    const where: Prisma.PostWhereInput = {};
    if (filter) {
      where.OR = [
        { title: { contains: filter } },
        { description: { contains: filter } },
        { content: { contains: filter } },
      ];
    }

    if (startDate && endDate) {
      where.publishDate = { gte: startDate, lte: endDate };
    }

    if (status) where.status = status;
    if (!isPermission) {
      where.status = EPostStatus.PUBLISHED;
      where.deleted = false;
    }
    if (hot) where.hot = hot;
    if (authorId) where.authorId = authorId;
    if (authName) where.author = { username: authName };
    if (categories)
      where.categories = { some: { categoryId: { in: categories } } };
    if (includeIds && includeIds.length > 0) {
      where.id = { in: _.uniq(_.filter(includeIds)) };
    }
    if (excludeIds && excludeIds.length > 0) {
      where.id = { notIn: _.uniq(_.filter(excludeIds)) };
    }

    if (featured) {
      where.metas = {
        some: {
          key: postMetaKey.POST_FEATURED,
        },
      };
    }

    const total = await this.prisma.post.count({
      where,
    });

    return total;
  }

  async findMany(
    {
      filter,
      take,
      skip,
      startDate,
      endDate,
      status,
      hot,
      authorId,
      authName,
      categories,
      includeIds,
      excludeIds,
      orderBy,
      featured,
      select,
    }: PostFindManyDto,
    currentUser: IUser,
  ): Promise<IFindManyResponse<IPost>> {
    let isPermission = hasPermission(currentUser, [permissions.POST_MANAGE]);
    if (authorId === currentUser?.id) isPermission = true;

    const where: Prisma.PostWhereInput = {};
    if (filter) {
      where.OR = [
        { title: { contains: filter } },
        { description: { contains: filter } },
        { content: { contains: filter } },
      ];
    }

    if (startDate && endDate) {
      where.publishDate = { gte: startDate, lte: endDate };
    }

    if (status) where.status = status;
    if (!isPermission) {
      where.status = EPostStatus.PUBLISHED;
      where.deleted = false;
    }
    if (hot) where.hot = hot;
    if (authorId) where.authorId = authorId;
    if (authName) where.author = { username: authName };
    if (categories && categories.length > 0)
      where.categories = { some: { categoryId: { in: categories } } };

    if (includeIds && includeIds.length > 0) {
      where.id = { in: _.uniq(_.filter(includeIds)) };
    }
    if (excludeIds && excludeIds.length > 0) {
      where.id = { notIn: _.uniq(_.filter(excludeIds)) };
    }

    if (featured) {
      where.metas = {
        some: {
          key: postMetaKey.POST_FEATURED,
        },
      };
    }

    const selectType = postSelect[select];

    const prismaPosts = await this.prisma.post.findMany({
      where,
      select: selectType,
      skip,
      take,
      orderBy,
    });

    let posts: IPost[] = prismaPosts.map((post) => this.parsePost(post));

    if (posts && posts.length > 0 && select === 'full') {
      const promisePost = posts.map(async (post) => {
        let data = await this.assignCategory(post);
        data = await this.assignRelated(data);
        data = await this.assignAction(data);
        return data;
      });
      posts = await Promise.all(promisePost);
    }

    const total = await this.prisma.post.count({
      where,
    });

    return { items: posts, total };
  }

  async assignCategory(data: IPost): Promise<IPost> {
    if (!data.categories || data.categories.length === 0) {
      data.categories = [];
      return data;
    }
    const categories: ICategory[] = [...data.categories];

    const categoryIds = categories
      ? categories.map((item) => item.categoryId)
      : [];

    if (!categoryIds || categoryIds.length === 0) return data;

    const categoryArr = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: CategoryBasicSelect,
    });

    data.categories = categoryArr.map((item: ICategory) => {
      const category = categories.find((el) => el.categoryId === item.id);
      return {
        ...item,
        sort: category.sort,
      };
    });

    data.categories = data.categories.sort((a, b) => a.sort - b.sort);

    return data;
  }

  async assignRelated(data: IPost): Promise<IPost> {
    if (!data.related || data.related.length === 0) {
      data.related = [];
      return data;
    }
    const related: IPost[] = [...data.related];

    const relatedIds = related ? related.map((item) => item.postRelatedId) : [];

    if (!relatedIds || relatedIds.length === 0) return data;

    const relatedArr = await this.prisma.post.findMany({
      where: { id: { in: relatedIds } },
      select: postSelect.basic,
    });

    data.related = relatedArr.map((item: Post) => {
      const postRelated = related.find((el) => el.postRelatedId === item.id);
      return { ...this.parsePost(item), sort: postRelated?.sort ?? 0 };
    });

    data.related = data.related.sort(
      (first, second) => (first.sort ?? 0) - (second.sort ?? 0),
    );

    return data;
  }

  async assignAction(data: IPost): Promise<IPost> {
    // TODO: attach user-specific post actions when implemented
    return data;
  }

  async sitemapCount(): Promise<number> {
    return await this.prisma.post.count({
      where: { status: EPostStatus.PUBLISHED, deleted: false },
    });
  }

  async sitemap({ take, skip }: FindManyDto): Promise<IPost[]> {
    return this.prisma.post.findMany({
      where: { status: EPostStatus.PUBLISHED, deleted: false },
      orderBy: { createdAt: 'asc' },
      take,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async updateStatistic(id: string): Promise<boolean> {
    try {
      const post = await this.prisma.post.findFirst({
        where: { id },
        select: { id: true, views: true },
      });
      if (!post) return false;

      await this.prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          views: ++post.views,
        },
      });

      const findPostToday = await this.prisma.postMeta.findFirst({
        where: {
          key: postMetaKey.POST_CLICK,
          postId: post.id,
          createdAt: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
        },
        select: { id: true, value: true },
        orderBy: { createdAt: 'desc' },
      });

      if (findPostToday?.id) {
        const value = findPostToday.value
          ? (parseInt(findPostToday.value) + 1).toString()
          : '1';
        await this.prisma.postMeta.update({
          where: { id: findPostToday.id },
          data: {
            value,
          },
        });
      } else {
        await this.prisma.postMeta.create({
          data: {
            key: postMetaKey.POST_CLICK,
            value: '1',
            post: { connect: { id: post.id } },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(JSON.stringify(error));
    }
  }

  async trendingPosts({
    skip,
    take,
    filter,
    authorId,
    hot,
    authName,
    categories,
    includeIds,
    excludeIds,
    featured,
    endDate = new Date(),
    startDate = new Date(Date.now() - 172800000),
  }: PostFindManyDto) {
    const where: Prisma.PostWhereInput = {};
    if (filter) {
      where.OR = [
        { title: { contains: filter } },
        { description: { contains: filter } },
      ];
    }

    if (hot) where.hot = hot;
    if (authorId) where.authorId = authorId;
    if (authName) where.author = { username: authName };
    if (categories && categories.length > 0)
      where.categories = { some: { categoryId: { in: categories } } };

    if (includeIds && includeIds.length > 0) {
      where.id = { in: _.uniq(_.filter(includeIds)) };
    }
    if (excludeIds && excludeIds.length > 0) {
      where.id = { notIn: _.uniq(_.filter(excludeIds)) };
    }

    if (featured) {
      where.metas = {
        some: {
          key: postMetaKey.POST_FEATURED,
        },
      };
    }
    const postMetas = await this.prisma.postMeta.findMany({
      where: {
        key: postMetaKey.POST_CLICK,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        post: {
          status: EPostStatus.PUBLISHED,
          ...where,
        },
      },
      select: { id: true, value: true, post: { select: postSelect.detail } },
    });
    type TrendingPostAggregate = {
      id: string;
      value: number;
      post: IPost;
    };
    let posts: TrendingPostAggregate[] = [];

    if (postMetas.length > 0) {
      for (const meta of postMetas) {
        const index = posts.findIndex(
          (entry) => entry.post.id === meta.post.id,
        );
        if (index >= 0) {
          posts[index].value += parseInt(meta.value, 10);
        } else {
          posts.push({
            id: meta.id,
            value: parseInt(meta.value, 10),
            post: this.parsePost(meta.post),
          });
        }
      }
    }

    posts = posts.sort((a, b) => {
      if (a.value < b.value) {
        return 1;
      }
      if (a.value > b.value) {
        return -1;
      }
      return 0;
    });

    posts = posts
      .filter((el) => el.post?.status === EPostStatus.PUBLISHED)
      .slice(skip, take);

    const trendingPostId = posts.map((el) => el.post.id);

    const promisePostIds = posts.map(async (el) => {
      await this.addPostFeatured(el.post.id);
      el.post = await this.assignCategory(el.post);
      el.post = await this.assignAction(el.post);
      return { value: el.value, ...el.post };
    });

    let postIds: IPost[] = (await Promise.all(promisePostIds)) as IPost[];

    if (postIds.length < take) {
      const newSkip = skip === 0 ? 0 : skip - trendingPostId.length;
      const prismaPosts2 = await this.prisma.post.findMany({
        where: {
          id: { notIn: trendingPostId },
          status: EPostStatus.PUBLISHED,
          ...where,
        },
        skip: newSkip,
        take: take - posts.length,
        orderBy: { publishDate: 'desc' },
        select: postSelect.detail,
      });
      const posts2 = prismaPosts2.map((post) => this.parsePost(post));
      const promise = posts2.map(async (post) => {
        const withCategory = await this.assignCategory(post);
        return this.assignAction(withCategory);
      });
      const promiseAll = await Promise.all(promise);
      postIds = [...postIds, ...promiseAll];
    }

    return postIds;
  }

  async addPostFeatured(id: string): Promise<void> {
    await this.prisma.postMeta.deleteMany({
      where: {
        key: postMetaKey.POST_FEATURED,
        value: 'true',
        post: { id },
      },
    });
    await this.prisma.postMeta.create({
      data: {
        key: postMetaKey.POST_FEATURED,
        value: 'true',
        post: { connect: { id } },
      },
    });
  }

  async getPostSummary({
    currentUser,
  }: {
    currentUser: IUser;
  }): Promise<IPostSummary> {
    const result: IPostSummary = {
      total: 0,
      draft: 0,
      pending: 0,
      scheduled: 0,
      published: 0,
      trash: 0,
      hot: 0,
    };

    const isPermission = hasPermission(currentUser, [permissions.POST_MANAGE]);

    const where: Prisma.PostWhereInput = isPermission
      ? {}
      : {
          authorId: currentUser.id,
        };

    const total = await this.prisma.post.count({
      where,
    });
    result.total = total;

    const posts = await this.prisma.post.count({
      where: {
        ...where,
        status: EPostStatus.DRAFT,
      },
    });
    result.draft = posts;

    const pending = await this.prisma.post.count({
      where: {
        ...where,
        status: EPostStatus.PENDING,
      },
    });
    result.pending = pending;

    const scheduled = await this.prisma.post.count({
      where: {
        ...where,
        status: EPostStatus.SCHEDULED,
      },
    });
    result.scheduled = scheduled;

    const published = await this.prisma.post.count({
      where: {
        ...where,
        status: EPostStatus.PUBLISHED,
      },
    });
    result.published = published;

    const trash = await this.prisma.post.count({
      where: {
        ...where,
        deleted: true,
      },
    });
    result.trash = trash;

    const hot = await this.prisma.post.count({
      where: {
        ...where,
        hot: true,
      },
    });
    result.hot = hot;

    return result;
  }

  parsePost(post: Partial<Post>): IPost {
    return {
      id: post.id || '',
      ...post,
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date(),
    };
  }
}
