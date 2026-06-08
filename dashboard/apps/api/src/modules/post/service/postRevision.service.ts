import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { PostRevisionFindManyDto } from '../dto/postRevision.dto';
import { postMetaKey } from '../post.const';

@Injectable()
export class PostRevisionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany({ id, take, skip, orderBy }: PostRevisionFindManyDto) {
    const findTopRevision = await this.prismaService.postMeta.findMany({
      where: { postId: id, key: postMetaKey.POST_KEY_UPDATE },
      select: {
        id: true,
        value: true,
        createdAt: true,
      },
      orderBy,
      take,
      skip,
    });

    return findTopRevision.map((item) => {
      const value = JSON.parse(item.value);
      return {
        id: item.id,
        createdAt: item.createdAt,
        value: {
          id: value.id,
          title: value.title,
        },
      };
    });
  }

  async findOneById({ id }) {
    const postMeta = await this.prismaService.postMeta.findUnique({
      where: { id },
      select: {
        id: true,
        value: true,
        createdAt: true,
        postId: true,
        post: true,
      },
    });
    return postMeta;
  }
}
