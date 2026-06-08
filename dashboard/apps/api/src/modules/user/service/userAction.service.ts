import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ELanguage, EUserLevel, EUserStatus, Prisma } from '@prisma/client';
import {
  DEFAULT_USER_SETTING,
  permissions,
  randomString,
} from '@seven-auto/libs';
import { hasPermission, type IUser } from '@seven-auto/libs';
import { userError } from 'src/messages/user.message';
import { AuthHelperService } from 'src/modules/auth/auth.helper';
import { LoggerService } from 'src/modules/logger/logger.service';
import { MediaQueryService } from 'src/modules/media/service/mediaQuery.service';
import { PrismaService } from 'src/prisma/prisma.service';
import striptags from 'striptags';

import { UserCreateDto, UserUpdateDto } from '../dto/user.dto';
import { UserHelper } from '../user.helper';
import { userSelect } from '../user.select';
import { UserQueryService } from './userQuery.service';
@Injectable()
export class UserActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userQueryService: UserQueryService,
    private readonly userHelper: UserHelper,
    private readonly logger: LoggerService,
    private readonly mediaQueryService: MediaQueryService,
    private readonly authHelper: AuthHelperService,
  ) {}

  async create(
    {
      fullname,
      username,
      password,
      email,
      roleId,
      isVerified = false,
      status = EUserStatus.PENDING,
      referrerId,
      avatarId,
      coverId,
      // sendMail,
      address,
      country,
      region,
      city,
      zipCode,
      socials,
      about,
      phone,
      score,
      // credits,
      level,
      activityStatus,
      setting,
      language,
      gender,
    }: UserCreateDto,
    currentUser?: IUser,
    select?: Prisma.UserSelect,
  ): Promise<IUser> {
    try {
      if (!email) throw new BadRequestException(userError.email_required);
      const checkEmail = await this.userQueryService.checkEmail({ email });
      if (checkEmail) throw new BadRequestException(userError.email_exists);
      if (!fullname) throw new BadRequestException(userError.fullname_required);
      fullname = striptags(fullname);

      const isAdmin = hasPermission(currentUser, [permissions.USER_CREATE]);

      //Auto generated Username
      username = await this.userHelper.generateUsername(username, fullname);
      const checkUsername = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true, username: true },
      });

      if (checkUsername && checkUsername.id)
        username = `${username}-${randomString(5)}`;
      //End Auto generated Username

      const data: Prisma.UserCreateInput = {
        email: email.toLowerCase(),
        fullname,
        username,
        status: EUserStatus.PENDING,
        about,
        address,
        country,
        region,
        city,
        zipCode,
        socials: socials as Prisma.JsonValue,
        setting: setting as unknown as Prisma.JsonValue,
        activityStatus,
        language: language || ELanguage.en,
        gender,
        updatedAt: new Date(),
      };

      if (isVerified && isAdmin) data.isVerified = isVerified;
      if (status && isAdmin) data.status = status;

      if (score && isAdmin) data.score = score;
      // if (credits && isAdmin) data.credits = credits;
      if (level && isAdmin) data.level = level as EUserLevel;

      if (password) {
        const hashPassword = await this.authHelper.hashPassword(password);
        data.password = hashPassword;
      }

      if (phone) {
        data.phone = striptags(phone);
        if (data.phone) {
          const checkPhone = await this.prisma.user.findFirst({
            where: { phone: data.phone },
            select: { id: true },
          });
          if (checkPhone && checkPhone.id)
            throw new NotFoundException(userError.phone_exists);
        }
      }

      if (roleId && isAdmin) {
        const findRole = await this.prisma.role.findUnique({
          where: { id: roleId },
        });
        if (findRole && findRole.id) data.role = { connect: { id: roleId } };
      }

      if (referrerId) {
        const referrer = await this.prisma.user.findUnique({
          where: { id: referrerId },
          select: { id: true },
        });
        if (referrer && referrer.id) {
          data.referrer = { connect: { id: referrerId } };
        }
      }

      if (avatarId) {
        const checkMedia =
          await this.mediaQueryService.checkMediaExist(avatarId);
        if (checkMedia) {
          data.avatar = { connect: { id: avatarId } };
        }
      }

      if (coverId) {
        const checkMedia =
          await this.mediaQueryService.checkMediaExist(coverId);
        if (checkMedia) {
          data.cover = { connect: { id: coverId } };
        }
      }

      if (!data.setting) {
        data.setting = DEFAULT_USER_SETTING;
      }

      const user = await this.prisma.user.create({
        data,
        select: select ? select : isAdmin ? userSelect.admin : userSelect.basic,
      });

      return this.userQueryService.parseUser(user);
    } catch (error) {
      if (error instanceof Error) {
        await this.logger.error(error.message, 'UserService-createUser');
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  async update(
    {
      id,
      email,
      fullname,
      username,
      phone,
      about,
      content,
      avatarId,
      coverId,
      roleId,
      socials,
      address,
      city,
      country,
      region,
      zipCode,
      isVerified,
      status,
      password,
      referrerId,
      score,
      level,
      activityStatus,
      setting,
      language,
      gender,
    }: UserUpdateDto,
    currentUser?: IUser,
  ): Promise<IUser> {
    try {
      if (!currentUser) throw new ForbiddenException('Forbidden');
      //remove the ID from the updates
      let isPermission = false;
      if (hasPermission(currentUser, [permissions.USER_UPDATE]))
        isPermission = true;
      if (currentUser.id !== id && !isPermission)
        throw new BadRequestException(userError.does_not_allowed);

      const isAdmin = hasPermission(currentUser, [permissions.USER_UPDATE]);

      const data: Prisma.UserUpdateInput = {};

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          avatarId: true,
        },
      });

      if (!user || !user.id)
        throw new BadRequestException(userError.user_not_found);

      if (username) {
        username = await this.userHelper.generateUsername(username, '');
        const checkUsername = await this.prisma.user.findFirst({
          where: { username, NOT: { id } },
        });
        if (checkUsername && checkUsername.id)
          throw new BadRequestException(userError.username_exists);

        data.username = username;
      }

      if (phone && phone != user.phone) {
        data.phone = striptags(phone);
        if (data.phone) {
          const checkPhone = await this.prisma.user.findFirst({
            where: { phone: data.phone, NOT: { id } },
            select: { id: true },
          });
          if (checkPhone && checkPhone.id)
            throw new NotFoundException(userError.phone_exists);
        }
      }

      if (fullname) data.fullname = striptags(fullname);

      if (avatarId) {
        const checkMedia =
          await this.mediaQueryService.checkMediaExist(avatarId);
        if (checkMedia) data.avatar = { connect: { id: avatarId } };
      }

      if (coverId) {
        const checkMedia =
          await this.mediaQueryService.checkMediaExist(coverId);
        if (checkMedia) data.cover = { connect: { id: coverId } };
      }

      if (about) data.about = striptags(about, ['p', 'li', 'a', 'ol', 'ul']);
      if (content) data.content = content;

      if (email && (!user.email || isPermission)) {
        const checkEmail = await this.prisma.user.findFirst({
          where: { email, NOT: { id } },
        });
        if (checkEmail && checkEmail.id)
          throw new NotFoundException(userError.email_exists);
        data.email = striptags(email);
      }

      if (roleId && isAdmin) {
        const findRole = await this.prisma.role.findUnique({
          where: { id: roleId },
        });
        if (findRole && findRole.id) data.role = { connect: { id: roleId } };
      }

      if (socials !== undefined)
        data.socials = socials as Prisma.InputJsonValue;
      if (address !== undefined) data.address = address;
      if (city !== undefined) data.city = city;
      if (country !== undefined) data.country = country;
      if (region !== undefined) data.region = region;
      if (zipCode !== undefined) data.zipCode = zipCode;
      if (activityStatus !== undefined) data.activityStatus = activityStatus;
      if (language !== undefined) data.language = language;
      if (gender !== undefined) data.gender = gender;
      if (setting !== undefined)
        data.setting = setting as unknown as Prisma.InputJsonValue;
      if (isAdmin) {
        if (isVerified !== undefined) data.isVerified = isVerified;
        if (status) data.status = status;
        if (score) data.score = score;
        // if (credits) data.credits = credits;
        if (level) data.level = level as EUserLevel;
        if (referrerId) {
          const referrer = await this.prisma.user.findUnique({
            where: { id: referrerId },
            select: { id: true },
          });
          if (referrer && referrer.id) {
            data.referrer = { connect: { id: referrerId } };
          }
        }
        if (password) {
          const hashPassword = await this.authHelper.hashPassword(password);
          data.password = hashPassword;
        }
      }

      //run the update method
      const update = await this.prisma.user.update({
        data,
        where: { id },
        select: isAdmin ? userSelect.admin : userSelect.basic,
      });

      return this.userQueryService.parseUser(update);
    } catch (error) {
      if (error instanceof Error) {
        await this.logger.error(error.message, 'UserService-updateUser');
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  async delete(id: string, currentUser: IUser): Promise<IUser> {
    const existUser = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        content: true,
      },
    });

    if (!existUser) throw new BadRequestException(userError.user_not_found);

    if (!hasPermission(currentUser, [permissions.USER_DELETE])) {
      throw new BadRequestException(userError.does_not_allowed);
    }

    const deleteUser = await this.prisma.user.delete({
      where: { id },
      select: userSelect.basic,
    });

    return this.userQueryService.parseUser(deleteUser);
  }

  async deleteMany(ids: string[], currentUser: IUser): Promise<IUser[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException(userError.not_found);
    }
    if (!hasPermission(currentUser, [permissions.USER_DELETE])) {
      throw new BadRequestException(userError.does_not_allowed);
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: userSelect.basic,
    });

    if (!users || !users.length)
      throw new BadRequestException(userError.user_not_found);

    await this.prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    return users.map((user) => this.userQueryService.parseUser(user));
  }
}
