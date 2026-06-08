import { Injectable } from '@nestjs/common';
import { EPostStatus, EStatus, Prisma } from '@prisma/client';
import {
  ICategory,
  IFindCategoryWithPostResponse,
  IFindManyResponse,
  IPost,
  removeNullObject,
} from '@seven-auto/libs';
import { FindManyDto } from 'src/dto/utils.dto';
import { postSelect } from 'src/modules/post/post.select';
import { PostService } from 'src/modules/post/post.service';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  CategoryBasicSelect,
  CategoryDetailSelect,
  CategoryFullSelect,
} from '../category.select';
import {
  CategoryFindManyDto,
  CategoryFindManyPostDto,
} from '../dto/categoryQuery.dto';

@Injectable()
export class CategoryQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async findMany({
    take,
    skip,
    filter,
    orderBy,
    status,
    deleted,
    isSort,
    select,
  }: CategoryFindManyDto): Promise<IFindManyResponse<ICategory>> {
    const where: Prisma.CategoryWhereInput = removeNullObject({
      status,
      deleted,
      ...(filter && { OR: [{ title: { contains: filter } }] }),
      ...(isSort && { sort: { gt: 0 } }),
    });
    let selectType = CategoryBasicSelect;
    if (select === 'full') selectType = CategoryFullSelect;
    if (select === 'detail') selectType = CategoryDetailSelect;
    const categories: ICategory[] = await this.prisma.category.findMany({
      where,
      take,
      skip,
      orderBy,
      select: selectType,
    });

    const total = await this.prisma.category.count({ where });

    return { items: categories, total };
  }

  async findOneById(id: string, select = 'basic'): Promise<ICategory> {
    let selectType = CategoryBasicSelect;
    if (select === 'full') selectType = CategoryFullSelect;
    if (select === 'detail') selectType = CategoryDetailSelect;
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: selectType,
    });
    return category;
  }

  async findOneBySlug(slug: string): Promise<ICategory> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: CategoryBasicSelect,
    });
    return category;
  }

  async findAllPosts(
    slug: string,
    { take, skip, orderBy }: CategoryFindManyPostDto,
  ): Promise<IFindCategoryWithPostResponse> {
    const category = await this.findOneBySlug(slug);
    if (!category) return { total: 0, items: [], category: null };

    const categoryPosts = await this.prisma.postCategory.findMany({
      where: {
        categoryId: category.id,
        post: { status: EPostStatus.PUBLISHED, deleted: false },
      },
      take,
      skip,
      select: {
        id: true,
        post: {
          select: postSelect.basic,
        },
      },
      orderBy: { post: orderBy },
    });
    if (categoryPosts.length === 0) return { total: 0, items: [], category };

    const promisePost = categoryPosts.map(async (item) => {
      const post = this.postService.parsePost(item.post);
      const data = await this.postService.assignCategory(post);
      return data;
    });
    const posts = await Promise.all(promisePost);

    const total = await this.prisma.postCategory.count({
      where: {
        categoryId: category.id,
        post: { status: EPostStatus.PUBLISHED, deleted: false },
      },
    });

    return { items: posts, total, category };
  }

  async sitemapCount(): Promise<number> {
    return await this.prisma.category.count({
      where: { status: EStatus.ACTIVE, deleted: false },
    });
  }

  async sitemap({ take, skip }: FindManyDto): Promise<IPost[]> {
    return this.prisma.category.findMany({
      where: { status: EStatus.ACTIVE, deleted: false },
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

  async topCategory({
    take,
    skip,
  }: FindManyDto): Promise<IFindManyResponse<ICategory>> {
    // Get list category order count post mysql

    const query = `SELECT c.id, c.title, c.slug, COUNT(p.id) AS countPost
      FROM categories c
      LEFT JOIN post_relation_category prc ON prc.categoryId = c.id
      LEFT JOIN posts p ON p.id = prc.postId
      WHERE c.status = 'ACTIVE' AND c.deleted = 0 AND p.status = 'PUBLISHED' AND p.deleted = false
      GROUP BY c.id
      ORDER BY countPost DESC
      LIMIT ${take} OFFSET ${skip}`;

    const result = await this.prisma.$queryRawUnsafe(query);

    if (result && Array.isArray(result) && result.length === 0)
      return { items: [], total: 0 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promise = (result as any[]).map((item: any) => {
      item.countPost = parseInt(item.countPost.toString());
      return item;
    });

    const categories = await Promise.all(promise);

    const total = await this.prisma.category.count({
      where: { status: EStatus.ACTIVE, deleted: false },
    });
    return { items: categories, total };
  }
}
