import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICategory, removeNullObject } from '@seven-auto/libs';
import { MediaQueryService } from 'src/modules/media/service/mediaQuery.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CategoryUpdateDto } from './../dto/categoryUpdate.dto';

@Injectable()
export class CategoryUpdateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mediaQueryService: MediaQueryService,
  ) {}

  async update(
    id: string,
    {
      title,
      description,
      status,
      sort,
      imageId,
      iconId,
      color,
      slug,
    }: CategoryUpdateDto,
  ): Promise<ICategory> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!category) throw new BadRequestException(`Category not found`);

    const data: Prisma.CategoryUpdateInput = removeNullObject({
      title,
      status,
      description,
      sort,
      color,
    });

    if (slug && slug !== category.slug) {
      slug = await this.generateSlug(slug);
      data.slug = slug;
    }

    const checkMediaImage =
      await this.mediaQueryService.checkMediaExist(imageId);
    const checkMediaIcon = await this.mediaQueryService.checkMediaExist(iconId);

    if (checkMediaImage) {
      data.mediaImage = { connect: { id: imageId } };
    } else if (imageId === '') {
      data.mediaImage = { disconnect: true };
    }

    if (checkMediaIcon) {
      data.mediaIcon = { connect: { id: iconId } };
    } else if (iconId === '') {
      data.mediaIcon = { disconnect: true };
    }

    const update = await this.prismaService.category.update({
      where: { id },
      data,
    });

    if (!update)
      throw new HttpException(
        'Category update unsuccessful',
        HttpStatus.BAD_REQUEST,
      );

    return update;
  }

  async generateSlug(slug: string): Promise<string> {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (category) slug = `${slug}-${new Date().getTime()}`;
    return slug;
  }
}
