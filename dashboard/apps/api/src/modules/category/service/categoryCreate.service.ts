import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICategory, removeNullObject } from '@seven-auto/libs';
import slugify from 'slugify';
import { MediaQueryService } from 'src/modules/media/service/mediaQuery.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CategoryCreateDto } from '../dto/categoryCreate.dto';

@Injectable()
export class CategoryCreateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mediaQueryService: MediaQueryService,
  ) {}

  async create({
    title,
    description,
    status,
    sort,
    imageId,
    iconId,
    color,
    slug,
  }: CategoryCreateDto): Promise<ICategory> {
    try {
      if (!title) throw new BadRequestException('Title is required');
      slug = await this.generateSlugByTitle(slug, title);

      const data: Prisma.CategoryCreateInput = removeNullObject({
        title,
        slug,
        description,
        status,
        sort,
        color,
      }) as Prisma.CategoryCreateInput;

      const checkMediaImage =
        await this.mediaQueryService.checkMediaExist(imageId);
      const checkMediaIcon =
        await this.mediaQueryService.checkMediaExist(iconId);

      if (checkMediaImage) {
        data.mediaImage = { connect: { id: imageId } };
      }

      if (checkMediaIcon) {
        data.mediaIcon = { connect: { id: iconId } };
      }

      const create = await this.prismaService.category.create({ data });
      return create;
    } catch (err) {
      throw new HttpException(
        err instanceof Error ? err.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateSlugByTitle(slug: string, title: string): Promise<string> {
    if (!slug) slug = title;
    let generateSlug = slugify(slug, { lower: true, strict: true });

    const category = await this.prismaService.category.findUnique({
      where: { slug: generateSlug },
      select: { id: true },
    });
    if (category) generateSlug = `${generateSlug}-${new Date().getTime()}`;
    return generateSlug;
  }
}
