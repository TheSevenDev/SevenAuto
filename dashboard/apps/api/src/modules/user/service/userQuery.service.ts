import { BadRequestException, Injectable } from '@nestjs/common';
import { EUserStatus, Prisma, User } from '@prisma/client';
import {
  hasPermission,
  IFindManyResponse,
  IUser,
  IUserFindMany,
  permissions,
  validateEmail,
} from '@seven-auto/libs';
import _ from 'lodash';
import { EmailRequireDto } from 'src/dto/utils.dto';
import { userError } from 'src/messages/user.message';
import { LoggerService } from 'src/modules/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import striptags from 'striptags';

import { UserDto, UserFindOneDto } from '../dto/user.dto';
import { UserHelper } from '../user.helper';
import { userSelect } from '../user.select';

@Injectable()
export class UserQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userHelper: UserHelper,
    private readonly logger: LoggerService,
  ) {}

  async userWhereMany(
    {
      filter,
      status,
      levels,
      deleted,
      roleId,
      referrerId,
      isVerified,
      endDate,
      startDate,
      includeIds,
      excludeIds,
    }: IUserFindMany,
    currentUser?: IUser,
  ): Promise<Prisma.UserWhereInput> {
    const isAdmin = hasPermission(currentUser, [permissions.USER_MANAGE]);

    const where: Prisma.UserWhereInput = {};

    where.status = EUserStatus.ACTIVE;
    where.deleted = false;

    if (referrerId) {
      where.referrerId = referrerId;
    }

    if (isAdmin) {
      delete where.status;
      if (status && status.length > 0) {
        where.status = {
          in: _.uniq(_.filter(status)),
        };
      }

      if (levels && levels.length > 0) {
        where.level = {
          in: _.uniq(_.filter(levels)),
        };
      }

      if (roleId) {
        where.roleId = roleId;
      }

      if (isVerified) {
        where.isVerified = isVerified;
      }

      delete where.deleted;
      if (deleted) {
        where.deleted = deleted === 1 ? true : false;
      }
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (referrerId && !isAdmin && currentUser?.id !== referrerId) {
      where.referrerId = referrerId;
    }

    if (filter) {
      where.OR = [
        { username: { contains: filter } },
        { fullname: { contains: filter } },
        { email: { contains: filter } },
        { phone: { contains: filter } },
        { address: { contains: filter } },
      ];
    }
    if (includeIds && includeIds.length > 0) {
      where.id = { in: _.uniq(_.filter(includeIds)) };
    }

    if (excludeIds && excludeIds.length > 0) {
      where.id = { notIn: _.uniq(_.filter(excludeIds)) };
    }
    return where;
  }

  async checkEmail({ email }: EmailRequireDto): Promise<boolean> {
    email = striptags(email);
    email = email.trim().toLowerCase();

    if (!email || !validateEmail(email))
      throw new BadRequestException(`Cannot get find email`);

    const checkEmail = await this.prisma.user.findFirst({
      where: { email: email },
      select: { id: true },
    });
    if (checkEmail && checkEmail.id) return true;
    return false;
  }

  async findOne(
    { id, email, username, address }: UserFindOneDto,
    currentUser?: IUser,
  ): Promise<IUser> {
    try {
      if (!id && !email && !username && !address)
        throw new BadRequestException(userError.user_not_found);
      let isPermission = false;
      if (hasPermission(currentUser, [permissions.USER_MANAGE]))
        isPermission = true;

      const select = isPermission ? userSelect.admin : userSelect.basic;

      const where: Prisma.UserWhereUniqueInput =
        {} as Prisma.UserWhereUniqueInput;
      if (id) where.id = id;
      else if (email) where.email = email;
      else if (username) where.username = username;

      const user = await this.prisma.user.findUnique({ where, select });
      if (!user) return null;
      // if (!isPermission) user = userCheckIsEnable(user);
      if (user && user.id) return new UserDto(user);
    } catch (error) {
      if (error instanceof Error) {
        await this.logger.error(error.message, 'UserService-FindOne');
        throw new BadRequestException(error.message);
      }
      await this.logger.error('Unknown error', 'UserService-FindOne');
      throw new BadRequestException('Unknown error');
    }
  }

  async findMany(
    args: IUserFindMany,
    currentUser?: IUser,
    forceSelect?: Prisma.UserSelect,
  ): Promise<IFindManyResponse<IUser>> {
    const isAdmin = hasPermission(currentUser, [permissions.USER_MANAGE]);

    const where = await this.userWhereMany(args, currentUser);
    try {
      const select = forceSelect
        ? forceSelect
        : isAdmin
          ? userSelect.admin
          : userSelect.basic;

      if (args.orderBy && args.orderBy.role) {
        args.orderBy.role = {
          name: args.orderBy.role,
        };
      }

      if (args.orderBy && args.orderBy.referrer) {
        args.orderBy.referrer = {
          fullname: args.orderBy.referrer,
        };
      }

      const prismaUsers: User[] = await this.prisma.user.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
        select: {
          ...select,
        },
      });

      const total = await this.prisma.user.count({
        where,
      });

      return { items: prismaUsers.map((user) => this.parseUser(user)), total };
    } catch (error) {
      if (error instanceof Error) {
        await this.logger.error(error.message, 'UserService-FindMany');
        throw new BadRequestException(error.message);
      }
      await this.logger.error('Unknown error', 'UserService-FindMany');
      throw new BadRequestException('Unknown error');
    }
  }

  async count(args: IUserFindMany, currentUser?: IUser): Promise<number> {
    const where = await this.userWhereMany(args, currentUser);
    const total = await this.prisma.user.count({
      where,
    });
    return total;
  }

  parseUser(user: Partial<User>): IUser | null {
    if (!user) return null;
    return new UserDto(user);
  }
}
