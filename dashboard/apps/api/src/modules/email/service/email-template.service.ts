import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindManyResponse } from '@seven-auto/libs';
import { EnvService } from 'src/modules/env/env.service';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  EmailTemplateDto,
  EmailTemplateFindManyDto,
  EmailTemplateFindOneDto,
  EmailTemplateUpdateDto,
} from '../email.dto';

@Injectable()
export class EmailTemplateService implements OnApplicationBootstrap {
  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
  ) {}

  onApplicationBootstrap() {
    // this.seed();
  }

  // async seed(): Promise<void> {
  //   const emailTemplates = await this.prisma.emailTemplate.findMany();
  //   const emailTemplatesKey = emailTemplates.map((item) => item.key);
  //   emailTemplateSeedData.forEach(async (item) => {
  //     if (!emailTemplatesKey.includes(item.key)) {
  //       await this.prisma.emailTemplate.create({
  //         data: {
  //           ...item,
  //           variables: JSON.stringify(item.variables),
  //           ...(item.langs &&
  //             item.langs.length > 0 && {
  //               langs: {
  //                 createMany: {
  //                   data: item.langs.map((lang) => ({
  //                     lang: lang.lang as ELanguage,
  //                     title: lang.title,
  //                     content: lang.content,
  //                   })),
  //                 },
  //               },
  //             }),
  //         },
  //       });
  //     }
  //   });
  // }

  async update(
    id: string,
    data: EmailTemplateUpdateDto,
  ): Promise<EmailTemplateDto> {
    const { name, title, content, langs } = data;
    const update = await this.prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(langs?.length && {
          langs: {
            upsert: langs.map((lang) => ({
              where: { id: lang.id },
              update: {
                lang: lang.lang,
                title: lang.title,
                content: lang.content,
              },
              create: {
                lang: lang.lang,
                title: lang.title,
                content: lang.content,
              },
            })),
          },
        }),
      },
      include: { langs: true },
    });
    return {
      ...update,
      variables: JSON.parse(update.variables),
    };
  }

  async findOne({
    id,
    key,
  }: EmailTemplateFindOneDto): Promise<EmailTemplateDto> {
    if (!id && !key) {
      throw new BadRequestException('ID or Key is required');
    }
    const where: Prisma.EmailTemplateWhereUniqueInput = id ? { id } : { key };

    const find = await this.prisma.emailTemplate.findUnique({
      where,
      include: { langs: true },
    });

    if (!find) return null;

    return {
      ...find,
      variables: find?.variables ? JSON.parse(find?.variables) : [],
    };
  }

  async findMany(
    args: EmailTemplateFindManyDto,
  ): Promise<IFindManyResponse<EmailTemplateDto>> {
    const where: Prisma.EmailTemplateWhereInput = {};
    if (args.filter) {
      where.OR = [
        {
          key: {
            contains: args.filter,
          },
        },
        {
          name: {
            contains: args.filter,
          },
        },
        {
          title: {
            contains: args.filter,
          },
        },
      ];
    }

    const findMany = await this.prisma.emailTemplate.findMany({
      where,
      orderBy: args.orderBy || { createdAt: 'desc' },
      take: args.take,
      skip: args.skip,
      include: { langs: true },
    });

    const total = await this.prisma.emailTemplate.count({ where });

    return {
      total,
      items: findMany.map((item) => ({
        ...item,
        variables: JSON.parse(item.variables),
      })),
    };
  }

  async delete(id: string): Promise<EmailTemplateDto> {
    const find = await this.prisma.emailTemplate.findUnique({
      where: {
        id,
      },
      include: { langs: true },
    });

    await this.prisma.emailTemplate.delete({
      where: {
        id,
      },
    });

    return {
      ...find,
      variables: JSON.parse(find.variables),
    };
  }
}
