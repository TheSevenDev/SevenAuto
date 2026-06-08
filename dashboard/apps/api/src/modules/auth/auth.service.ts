import { BadRequestException, Injectable } from '@nestjs/common';
import { ELanguage, EUserStatus } from '@prisma/client';
import {
  AuthVerifyType,
  EEmailTemplateKey,
  hasPermission,
  IAuthConfirmRegisterCode,
  IAuthResponse,
  IAuthSendRegister,
  IUser,
  permissions,
} from '@seven-auto/libs';
import { authError } from 'src/messages/auth.message';
import { permissionError } from 'src/messages/premission.message';
import { EnvService } from 'src/modules/env/env.service';
import { UserActionService } from 'src/modules/user/service/userAction.service';
import { UserQueryService } from 'src/modules/user/service/userQuery.service';
import { userMetaKey } from 'src/modules/user/user.const';
import { UserHelper } from 'src/modules/user/user.helper';
import { PrismaService } from 'src/prisma/prisma.service';

import { EmailHelper } from '../email/email.helper';
import {
  AuthChangePasswordDto,
  AuthConfirmRegisterDto,
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRefreshTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
} from './auth.dto';
import { AuthHelperService } from './auth.helper';
import { getMeSelect } from './auth.select';
import { userCheckIsEnable } from './auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelperService,
    private readonly userHelper: UserHelper,
    private readonly emailHelper: EmailHelper,
    private readonly userActionService: UserActionService,
    private readonly env: EnvService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async getMe(token: string): Promise<IUser> {
    if (!token) return null;
    try {
      const infoToken = await this.authHelper.verifyAccessToken(token);

      if (!infoToken || !infoToken.userId) return null;

      const prismaUser = await this.prisma.user.findUnique({
        where: { id: infoToken.userId },
        select: getMeSelect,
      });
      let user: IUser = this.userQueryService.parseUser(prismaUser);
      user = userCheckIsEnable(user);
      return user;
    } catch {
      return null;
    }
  }

  async login({ email, password }: AuthLoginDto): Promise<IAuthResponse> {
    if (!email) throw new BadRequestException(authError.email_required);
    if (!password) throw new BadRequestException(authError.password_required);

    //1. Check if there is a user with that email

    const prismaUser = await this.prisma.user.findFirst({
      where: { email },
      select: {
        ...getMeSelect,
        password: true,
      },
    });

    let user: IUser = this.userQueryService.parseUser(prismaUser);

    if (!user) throw new BadRequestException(authError.user_not_found);

    user = userCheckIsEnable(user) as IUser & { password: string };

    //2. check if their password is correct
    await this.authHelper.comparePassword(password, prismaUser.password);

    const { accessToken, refreshToken } = await this.authHelper.generateToken({
      userId: user.id,
    });

    await this.userHelper.deleteMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
      value: refreshToken,
    });

    return { accessToken, refreshToken, user };
  }

  async loginByAdmin(
    { email }: { email: string },
    currentUser: IUser,
  ): Promise<IAuthResponse> {
    if (!email) throw new BadRequestException(authError.email_required);

    if (!currentUser || !currentUser.id)
      throw new BadRequestException(authError.user_not_found);

    if (!hasPermission(currentUser, [permissions.USER_MANAGE]))
      throw new BadRequestException(permissionError.permission_denied);

    const prismaUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!prismaUser) throw new BadRequestException(authError.user_not_found);

    const { accessToken, refreshToken } = await this.authHelper.generateToken({
      userId: prismaUser.id,
    });

    return {
      accessToken,
      refreshToken,
      user: this.userQueryService.parseUser(prismaUser),
    };
  }

  async refreshToken({
    refreshToken,
  }: AuthRefreshTokenDto): Promise<IAuthResponse> {
    if (!refreshToken)
      throw new BadRequestException(authError.refresh_token_required);

    const infoToken = await this.authHelper.verifyRefreshToken(refreshToken);

    if (infoToken?.userId) {
      const prismaUser = await this.prisma.user.findFirst({
        where: { id: infoToken.userId.toString() },
        select: getMeSelect,
      });

      if (!prismaUser) {
        throw new BadRequestException(
          authError.user_not_found_with_refresh_token,
        );
      }
      let user: IUser = this.userQueryService.parseUser(prismaUser);

      user = userCheckIsEnable(user);

      const checkToken = await this.prisma.userMeta.findFirst({
        where: {
          user: { id: user.id },
          key: userMetaKey.REFRESH_TOKEN,
          value: { equals: refreshToken },
        },
        select: { id: true },
      });

      if (!checkToken || !checkToken.id)
        throw new BadRequestException(authError.refresh_token_invalid);

      const result = await this.authHelper.generateToken({ userId: user.id });

      // Fix for react render twice when refresh token
      // Work fine in production without this with strict mode
      if (this.env.APP_NODE_ENV === 'development') {
        await this.userHelper.createMeta({
          userId: user.id,
          key: userMetaKey.REFRESH_TOKEN,
          value: refreshToken,
        });

        // Clean up old refresh tokens that are older than 1 minute to avoid DB bloat
        await this.prisma.userMeta.deleteMany({
          where: {
            userId: user.id,
            key: userMetaKey.REFRESH_TOKEN,
            createdAt: {
              lt: new Date(Date.now() - 60 * 1000),
            },
          },
        });

        setTimeout(async () => {
          await this.prisma.userMeta.update({
            where: { id: checkToken.id },
            data: { value: result.refreshToken },
          });
        }, 5000);
      } else {
        await this.prisma.userMeta.update({
          where: { id: checkToken.id },
          data: { value: result.refreshToken },
        });
      }
      return { ...result, user };
    }
    return null;
  }

  async forgotPassword(
    { email }: AuthForgotPasswordDto,
    language: ELanguage,
  ): Promise<boolean> {
    if (!email) throw new BadRequestException(authError.email_required);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullname: true,
        email: true,
        metas: {
          where: { key: userMetaKey.PASSWORD_RESET_TOKEN },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) throw new BadRequestException(authError.email_not_found);

    // check after 5 minutes
    if (user.metas?.length) {
      const lastToken = user.metas[0];
      const diff = new Date().getTime() - lastToken.createdAt.getTime();
      if (diff < 5 * 60 * 1000)
        throw new BadRequestException(authError.please_wait_5_minutes);
    }

    const token = await this.authHelper.generateForgotPasswordToken({
      userId: user.id,
    });

    await this.userHelper.deleteMeta({
      userId: user.id,
      key: userMetaKey.PASSWORD_RESET_TOKEN,
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key: userMetaKey.PASSWORD_RESET_TOKEN,
      value: token,
    });

    // Send Mail
    const variablesEmail = {
      fullname: user.fullname,
      reset_link: `${this.env.BASE_URL}/auth/reset-password?token=${token}`,
    };
    await this.emailHelper.sendEmailTemplate({
      key: EEmailTemplateKey.FORGOT_PASSWORD,
      lang: language,
      email: user.email,
      variables: variablesEmail,
    });

    return true;
  }

  async resetPassword({
    token,
    password,
  }: AuthResetPasswordDto): Promise<boolean> {
    if (!token) throw new BadRequestException(authError.token_required);
    if (!password) throw new BadRequestException(authError.password_required);

    const infoToken = await this.authHelper.verifyForgotPasswordToken(token);

    if (!infoToken || !infoToken.userId)
      throw new BadRequestException(authError.token_invalid);

    const user = await this.prisma.user.findUnique({
      where: { id: infoToken.userId },
      select: {
        id: true,
        email: true,
        status: true,
        deleted: true,
        metas: {
          where: { key: userMetaKey.PASSWORD_RESET_TOKEN },
          select: { value: true },
        },
      },
    });

    if (!user) throw new BadRequestException(authError.user_not_found);

    if (!user || !user.id)
      throw new BadRequestException(authError.user_not_found);

    if (!user.metas || user.metas.length === 0)
      throw new BadRequestException(authError.token_invalid);

    if (user.metas[0].value !== token)
      throw new BadRequestException(authError.token_invalid);

    const newPassword = await this.authHelper.hashPassword(password);

    const updateUser = await this.prisma.user.update({
      where: { id: infoToken.userId },
      data: { password: newPassword },
      select: {
        id: true,
        email: true,
      },
    });

    await this.userHelper.deleteMeta({
      userId: updateUser.id,
      key: userMetaKey.PASSWORD_RESET_TOKEN,
    });

    return true;
  }

  async changePassword(
    { id }: IUser,
    { oldPassword, newPassword }: AuthChangePasswordDto,
  ): Promise<boolean> {
    if (!oldPassword)
      throw new BadRequestException(authError.old_password_required);
    if (!newPassword)
      throw new BadRequestException(authError.new_password_required);

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        deleted: true,
        password: true,
      },
    });

    if (!user) throw new BadRequestException(authError.user_not_found);

    await this.authHelper.comparePassword(oldPassword, user.password);

    const password = await this.authHelper.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id },
      data: { password },
    });

    return true;
  }

  async register(
    { fullname, email, password, verifyType, referrerId }: AuthRegisterDto,
    language: ELanguage,
    affiliateSessionId?: string,
  ): Promise<IAuthResponse> {
    if (!fullname) throw new BadRequestException(authError.fullname_required);
    if (!email) throw new BadRequestException(authError.email_required);
    if (!password) throw new BadRequestException(authError.password_required);

    const checkUser = await this.prisma.user.findUnique({
      where: { email },
      select: { ...getMeSelect },
    });

    if (checkUser)
      throw new BadRequestException(authError.email_already_exists);

    if (!referrerId && affiliateSessionId) {
      // TODO: get referrerId from affiliate session
    }

    let user = await this.userActionService.create(
      {
        email,
        fullname,
        password,
        referrerId,
        language,
      },
      null,
      getMeSelect,
    );

    await this.sendConfirmRegisterEmail(
      { email: user.email, verifyType },
      language,
    );

    user = userCheckIsEnable(user);

    const { accessToken, refreshToken } = await this.authHelper.generateToken({
      userId: user.id,
    });

    await this.userHelper.deleteMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
      value: refreshToken,
    });

    if (verifyType === AuthVerifyType.LINK) {
      return { accessToken, refreshToken, user };
    } else {
      return { accessToken: '', refreshToken: '', user };
    }
  }

  async sendConfirmRegisterEmail(
    { email, verifyType }: IAuthSendRegister,
    language: ELanguage,
  ): Promise<boolean> {
    if (!email) throw new BadRequestException(authError.email_required);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullname: true,
        isVerified: true,
        metas: {
          where: {
            key: {
              in: [
                userMetaKey.CONFIRM_REGISTER_TOKEN,
                userMetaKey.CONFIRM_REGISTER_CODE,
              ],
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) throw new BadRequestException(authError.email_not_found);

    if (user.isVerified)
      throw new BadRequestException(authError.user_is_verified);

    // check after 5 minutes
    if (user.metas?.length) {
      const lastToken = user.metas[0];
      const diff = new Date().getTime() - lastToken.createdAt.getTime();
      if (diff < 1 * 60 * 1000)
        throw new BadRequestException(authError.please_wait_5_minutes);
    }
    let value = '';
    if (verifyType === AuthVerifyType.LINK) {
      value = await this.authHelper.generateConfirmRegisterToken({
        userId: user.id,
      });
    } else {
      // random 6 digits
      value = Math.floor(100000 + Math.random() * 900000).toString();
    }

    await this.prisma.userMeta.deleteMany({
      where: {
        userId: user.id,
        key: {
          in: [
            userMetaKey.CONFIRM_REGISTER_TOKEN,
            userMetaKey.CONFIRM_REGISTER_CODE,
            userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
          ],
        },
      },
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key:
        verifyType === AuthVerifyType.LINK
          ? userMetaKey.CONFIRM_REGISTER_TOKEN
          : userMetaKey.CONFIRM_REGISTER_CODE,
      value,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: EUserStatus.PENDING },
    });

    // Send Mail
    const variablesEmail = {
      fullname: user.fullname,
      code: value,
      confirm_link: `${this.env.BASE_URL}/auth/confirm-register?token=${value}`,
    };

    await this.emailHelper.sendEmailTemplate({
      key:
        verifyType === AuthVerifyType.LINK
          ? EEmailTemplateKey.CONFIRM_REGISTER
          : EEmailTemplateKey.SEND_REGISTER_CODE,
      lang: language,
      email: user.email,
      variables: variablesEmail,
    });

    return true;
  }

  async confirmRegister({
    token,
  }: AuthConfirmRegisterDto): Promise<IAuthResponse> {
    if (!token) throw new BadRequestException(authError.token_required);

    const infoToken = await this.authHelper.verifyConfirmRegisterToken(token);

    if (!infoToken || !infoToken.userId)
      throw new BadRequestException(authError.token_invalid);

    const prismaUser = await this.prisma.user.findUnique({
      where: { id: infoToken.userId },
      select: {
        ...getMeSelect,
        metas: {
          where: { key: userMetaKey.CONFIRM_REGISTER_TOKEN },
          select: { id: true, value: true, createdAt: true, updatedAt: true },
        },
      },
    });

    if (!prismaUser) throw new BadRequestException(authError.user_not_found);
    let user: IUser = this.userQueryService.parseUser(prismaUser);

    if (!user || !user.id)
      throw new BadRequestException(authError.user_not_found);

    if (user.isVerified)
      throw new BadRequestException(authError.user_is_verified);

    if (!user.metas || user.metas.length === 0)
      throw new BadRequestException(authError.token_invalid);

    if (user.metas[0].value !== token)
      throw new BadRequestException(authError.token_invalid);

    await this.prisma.user.update({
      where: { id: infoToken.userId },
      data: { status: EUserStatus.ACTIVE, isVerified: true },
    });

    await this.prisma.userMeta.deleteMany({
      where: {
        userId: user.id,
        key: {
          in: [
            userMetaKey.CONFIRM_REGISTER_TOKEN,
            userMetaKey.CONFIRM_REGISTER_CODE,
            userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
          ],
        },
      },
    });

    const { accessToken, refreshToken } = await this.authHelper.generateToken({
      userId: user.id,
    });

    await this.userHelper.deleteMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
      value: refreshToken,
    });

    user = userCheckIsEnable({
      ...user,
      status: EUserStatus.ACTIVE,
      isVerified: true,
    }) as IUser & { password: string };

    return { accessToken, refreshToken, user };
  }

  async confirmRegisterCode({
    code,
    email,
  }: IAuthConfirmRegisterCode): Promise<IAuthResponse> {
    if (!code) throw new BadRequestException(authError.code_required);
    if (!email) throw new BadRequestException(authError.email_required);

    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...getMeSelect,
        metas: {
          where: { key: userMetaKey.CONFIRM_REGISTER_CODE },
          select: { id: true, value: true, createdAt: true, updatedAt: true },
        },
      },
    });

    let user: IUser = this.userQueryService.parseUser(prismaUser);

    if (!user) throw new BadRequestException(authError.email_not_found);
    if (user.isVerified)
      throw new BadRequestException(authError.user_is_verified);

    if (!user.metas || user.metas.length === 0)
      throw new BadRequestException(authError.code_invalid);

    // check code count
    const count = await this.prisma.userMeta.findFirst({
      where: {
        userId: user.id,
        key: userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
      },
    });

    if (count && parseInt(count.value as string) >= 5)
      throw new BadRequestException(authError.code_max_attempt);

    // update code count
    if (count) {
      await this.prisma.userMeta.update({
        where: { id: count.id },
        data: {
          value: (parseInt(count.value as string) + 1).toString(),
        },
      });
    } else {
      await this.userHelper.createMeta({
        userId: user.id,
        key: userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
        value: '1',
      });
    }

    // check after 5 minutes
    const lastToken = user.metas[0];
    const diff = new Date().getTime() - lastToken.createdAt.getTime();
    if (diff > 5 * 60 * 1000)
      throw new BadRequestException(authError.code_invalid);

    if (user.metas[0].value !== code)
      throw new BadRequestException(authError.code_invalid);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: EUserStatus.ACTIVE, isVerified: true },
    });

    await this.prisma.userMeta.deleteMany({
      where: {
        userId: user.id,
        key: {
          in: [
            userMetaKey.CONFIRM_REGISTER_TOKEN,
            userMetaKey.CONFIRM_REGISTER_CODE,
            userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
          ],
        },
      },
    });

    const { accessToken, refreshToken } = await this.authHelper.generateToken({
      userId: user.id,
    });

    await this.userHelper.deleteMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
    });

    await this.userHelper.createMeta({
      userId: user.id,
      key: userMetaKey.REFRESH_TOKEN,
      value: refreshToken,
    });

    user = userCheckIsEnable({
      ...user,
      status: EUserStatus.ACTIVE,
      isVerified: true,
    }) as IUser & { password: string };

    return { accessToken, refreshToken, user };
  }

  async logout({ id }: IUser): Promise<boolean> {
    await this.userHelper.deleteMeta({
      userId: id,
      key: userMetaKey.REFRESH_TOKEN,
    });
    return true;
  }
}
