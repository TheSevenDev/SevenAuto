import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICategory } from '@seven-auto/libs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryDeleteService {
  constructor(private readonly prismaService: PrismaService) {}
  async deleteCategoryById(categoryId: string): Promise<ICategory> {
    try {
      await this.prismaService.postCategory.deleteMany({
        where: { categoryId },
      });
      const category = await this.prismaService.category.delete({
        where: { id: categoryId },
      });
      return category;
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
