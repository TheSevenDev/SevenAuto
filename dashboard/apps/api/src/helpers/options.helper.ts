import { Injectable } from '@nestjs/common';
import { IOption } from '@seven-auto/libs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OptionHelper {
  constructor(private readonly prisma: PrismaService) {}

  async create(key: string, value: string): Promise<IOption> {
    return this.prisma.option.create({ data: { key, value } });
  }

  async get(key: string): Promise<string> {
    const options: IOption = await this.prisma.option.findFirst({
      where: { key: key },
      select: {
        id: true,
        key: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (options && options.value) {
      return options.value;
    } else {
      return '';
    }
  }

  async update(key: string, value: string): Promise<IOption> {
    let option: IOption = await this.prisma.option.findFirst({
      where: { key },
    });
    if (option && option.id) {
      option = await this.prisma.option.update({
        where: { id: option.id },
        data: { value },
      });
    } else {
      option = await this.prisma.option.create({ data: { key, value } });
    }
    return option;
  }

  async delete(key: string): Promise<number> {
    const data = await this.prisma.option.deleteMany({ where: { key } });
    return data.count;
  }
}
