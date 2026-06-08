import { Global, Injectable } from '@nestjs/common';
import { type IUser, type IUserMeta } from '@seven-auto/libs';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  UserHelperGetMetaDto,
  UserHelperUpdateMetaDto,
} from './dto/user.helper.dto';

@Global()
@Injectable()
export class UserHelper {
  constructor(private readonly prisma: PrismaService) {}

  async createMeta({
    userId,
    key,
    value,
  }: UserHelperUpdateMetaDto): Promise<IUserMeta> {
    return this.prisma.userMeta.create({
      data: { user: { connect: { id: userId } }, key, value },
    });
  }

  async getMeta({ userId, key }: UserHelperGetMetaDto): Promise<string> {
    const userMetas: IUserMeta = await this.prisma.userMeta.findFirst({
      where: { userId, key: key },
      select: {
        id: true,
        key: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (userMetas?.value != null) {
      return typeof userMetas.value === 'string'
        ? userMetas.value
        : JSON.stringify(userMetas.value);
    } else {
      return '';
    }
  }

  async updateMeta({
    userId,
    key,
    value,
  }: UserHelperUpdateMetaDto): Promise<IUserMeta> {
    let userMeta: IUserMeta = await this.prisma.userMeta.findFirst({
      where: { userId, key },
    });
    if (userMeta && userMeta.id) {
      userMeta = await this.prisma.userMeta.update({
        where: { id: userMeta.id },
        data: { value },
      });
    } else {
      userMeta = await this.prisma.userMeta.create({
        data: {
          key,
          value,
          user: { connect: { id: userId } },
        },
      });
    }
    return userMeta;
  }

  async deleteMeta({ userId, key }: UserHelperGetMetaDto): Promise<number> {
    const data = await this.prisma.userMeta.deleteMany({
      where: { userId, key: key },
    });
    return data.count;
  }

  async generateUsername(username: string, fullname: string): Promise<string> {
    if (!username) username = fullname;
    return slugify(username, { lower: true, strict: true });
  }

  async assignAvatar(data: IUser): Promise<IUser> {
    if (!data.avatarId) return data;

    const media = await this.prisma.media.findUnique({
      where: { id: data.avatarId },
    });

    if (media && media.id) {
      Object.assign(data, { avatar: media });
    }
    return data;
  }
}
