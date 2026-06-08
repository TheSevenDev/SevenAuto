import { BadRequestException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ELanguage, User } from '@prisma/client';
import { AuthVerifyType, type IUser, type IUserMeta } from '@seven-auto/libs';
import { mockUserFactory, mockUserPrisma } from 'src/_mock/user';
import { authError } from 'src/messages/auth.message';
import { UserActionService } from 'src/modules/user/service/userAction.service';
import { UserHelper } from 'src/modules/user/user.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { createAuthTestingModule } from 'src/test/create-auth-testing-module';

import { EmailHelper } from '../email/email.helper';
import { userMetaKey } from '../user/user.const';
import { AuthHelperService } from './auth.helper';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;
  let prismaService: PrismaService;
  let authHelper: AuthHelperService;
  let userHelper: UserHelper;
  let emailHelper: EmailHelper;
  let userActionService: UserActionService;

  beforeAll(async () => {
    module = await createAuthTestingModule();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    authHelper = module.get<AuthHelperService>(AuthHelperService);
    userHelper = module.get<UserHelper>(UserHelper);
    emailHelper = module.get<EmailHelper>(EmailHelper);
    userActionService = module.get<UserActionService>(UserActionService);
  });

  afterAll(async () => {
    await module?.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user', async () => {
      jest
        .spyOn(authHelper, 'verifyAccessToken')
        .mockResolvedValue({ userId: mockUserPrisma.id });

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserPrisma);

      const result = await authService.getMe('accessToken');
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUserPrisma.id,
          email: mockUserPrisma.email,
        }),
      );
    });
  });

  describe('login', () => {
    it('should throw an error if email is not provided', async () => {
      await expect(
        authService.login({ email: '', password: 'password' }),
      ).rejects.toThrow(new BadRequestException(authError.email_required));
    });

    it('should throw an error if password is not provided', async () => {
      await expect(
        authService.login({ email: 'test@example.com', password: '' }),
      ).rejects.toThrow(new BadRequestException(authError.password_required));
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(new BadRequestException(authError.user_not_found));
    });

    it('should return tokens if login is successful', async () => {
      const mockUserLogin: Partial<User> = {
        ...mockUserPrisma,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const mockToken = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUserFactory(mockUserLogin));
      jest.spyOn(authHelper, 'comparePassword').mockResolvedValue();
      jest.spyOn(authHelper, 'generateToken').mockResolvedValue(mockToken);
      jest.spyOn(userHelper, 'deleteMeta').mockResolvedValue(1);
      jest.spyOn(userHelper, 'createMeta').mockResolvedValue({
        id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
        userId: mockUserLogin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        ...mockToken,
        user: expect.objectContaining({
          id: mockUserPrisma.id,
          email: mockUserPrisma.email,
        }),
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw an error if refresh token is invalid', async () => {
      jest.spyOn(authHelper, 'verifyRefreshToken').mockResolvedValue(null);

      const result = await authService.refreshToken({
        refreshToken: 'invalidToken',
      });
      expect(result).toBeNull();
    });

    it('should return new tokens if refresh token is valid', async () => {
      jest.spyOn(authHelper, 'verifyRefreshToken').mockResolvedValue({
        userId: mockUserPrisma.id,
      });

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUserPrisma);

      jest.spyOn(prismaService.userMeta, 'findFirst').mockResolvedValue({
        id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
        userId: mockUserPrisma.id,
        key: userMetaKey.REFRESH_TOKEN,
        value: 'validToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(authHelper, 'generateToken').mockResolvedValue({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      jest.spyOn(userHelper, 'createMeta').mockResolvedValue({
        id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
        userId: mockUserPrisma.id,
        key: userMetaKey.REFRESH_TOKEN,
        value: 'newRefreshToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IUserMeta);

      jest.spyOn(prismaService.userMeta, 'update').mockResolvedValue({
        id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
        userId: mockUserPrisma.id,
        key: userMetaKey.REFRESH_TOKEN,
        value: 'newRefreshToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.refreshToken({
        refreshToken: 'validToken',
      });

      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        user: expect.objectContaining({
          id: mockUserPrisma.id,
          email: mockUserPrisma.email,
        }),
      });
    });
  });

  describe('forgotPassword', () => {
    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        authService.forgotPassword({ email: 'test@example.com' }, ELanguage.vi),
      ).rejects.toThrow(new BadRequestException(authError.email_not_found));
    });

    it('should send reset password email if user exists', async () => {
      const mockToken = 'resetToken';

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserPrisma);
      jest
        .spyOn(authHelper, 'generateForgotPasswordToken')
        .mockResolvedValue(mockToken);
      jest.spyOn(emailHelper, 'sendEmailTemplate').mockResolvedValue(true);

      const result = await authService.forgotPassword(
        { email: 'test@example.com' },
        ELanguage.vi,
      );
      // expect(authHelper.generateForgotPasswordToken).toHaveBeenCalledWith({
      //   userId: 1,
      // });
      // expect(emailHelper.sendEmailTemplate).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should throw an error if reset token is invalid', async () => {
      jest
        .spyOn(authHelper, 'verifyForgotPasswordToken')
        .mockResolvedValue(null);

      await expect(
        authService.resetPassword({
          token: 'invalidToken',
          password: 'password',
        }),
      ).rejects.toThrow(new BadRequestException(authError.token_invalid));
    });

    it('should reset password if token is valid', async () => {
      jest
        .spyOn(authHelper, 'verifyForgotPasswordToken')
        .mockResolvedValue({ userId: mockUserPrisma.id });
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
        mockUserFactory({
          metas: [
            {
              id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
              userId: mockUserPrisma.id,
              key: userMetaKey.PASSWORD_RESET_TOKEN,
              value: 'validToken',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }),
      );

      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(mockUserPrisma);

      jest.spyOn(userHelper, 'deleteMeta').mockResolvedValue(1);

      const result = await authService.resetPassword({
        token: 'validToken',
        password: 'password',
      });
      expect(result).toBe(true);
    });
  });

  describe('changePassword', () => {
    it('should throw an error if old password is not provided', async () => {
      await expect(
        authService.changePassword(
          {
            ...mockUserPrisma,
            setting: null,
          } as IUser,
          {
            oldPassword: '',
            newPassword: 'newPassword',
          },
        ),
      ).rejects.toThrow(
        new BadRequestException(authError.old_password_required),
      );
    });

    it('should throw an error if new password is not provided', async () => {
      await expect(
        authService.changePassword(
          {
            ...mockUserPrisma,
            setting: null,
          } as IUser,
          {
            oldPassword: 'oldPassword',
            newPassword: '',
          },
        ),
      ).rejects.toThrow(
        new BadRequestException(authError.new_password_required),
      );
    });

    it('should throw an error if old password is incorrect', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserFactory({ password: 'hashedPassword' }));
      jest
        .spyOn(authHelper, 'comparePassword')
        .mockRejectedValue(
          new BadRequestException(authError.password_is_incorrect),
        );

      await expect(
        authService.changePassword(
          {
            ...mockUserPrisma,
            setting: null,
          } as IUser,
          {
            oldPassword: 'oldPassword',
            newPassword: 'newPassword',
          },
        ),
      ).rejects.toThrow(
        new BadRequestException(authError.password_is_incorrect),
      );
    });

    it('should update password if old password is correct', async () => {
      jest.spyOn(authHelper, 'comparePassword').mockResolvedValue();
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserFactory({ password: 'hashedPassword' }));
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(mockUserPrisma);

      const result = await authService.changePassword(
        {
          ...mockUserPrisma,
          setting: null,
        } as IUser,
        {
          oldPassword: 'oldPassword',
          newPassword: 'newPassword',
        },
      );
      expect(result).toBe(true);
    });
  });

  describe('sendConfirmRegisterEmail', () => {
    it('should throw BadRequestException when email is not provided', async () => {
      await expect(
        authService.sendConfirmRegisterEmail(
          { email: '', verifyType: AuthVerifyType.LINK },
          ELanguage.vi,
        ),
      ).rejects.toThrow(new BadRequestException(authError.email_required));
    });

    it('should throw BadRequestException when user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        authService.sendConfirmRegisterEmail(
          { email: 'test@example.com', verifyType: AuthVerifyType.LINK },
          ELanguage.vi,
        ),
      ).rejects.toThrow(new BadRequestException(authError.email_not_found));
    });

    it('should throw BadRequestException when user is already verified', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(
        mockUserFactory({
          email: 'test@example.com',
          fullname: 'Test User',
          isVerified: true,
        }),
      );

      jest.spyOn(prismaService.userMeta, 'deleteMany').mockResolvedValueOnce({
        count: 0,
      });

      await expect(
        authService.sendConfirmRegisterEmail(
          { email: 'test@example.com', verifyType: AuthVerifyType.LINK },
          ELanguage.vi,
        ),
      ).rejects.toThrow(new BadRequestException(authError.user_is_verified));
    });

    it('should throw BadRequestException if confirmation was requested within the last minute', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: mockUserPrisma.id,
        email: 'test@example.com',
        fullname: 'Test User',
        isVerified: false,
        metas: [
          {
            key: userMetaKey.CONFIRM_REGISTER_CODE,
            value: '123456',
            createdAt: new Date(),
          },
        ],
      } as unknown as User);

      await expect(
        authService.sendConfirmRegisterEmail(
          { email: 'test@example.com' },
          ELanguage.vi,
        ),
      ).rejects.toThrow(
        new BadRequestException(authError.please_wait_5_minutes),
      );
    });

    it('should send confirmation email and return true for a valid unverified user', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(
        mockUserFactory({
          email: 'test@example.com',
          fullname: 'Test User',
          isVerified: false,
        }),
      );

      const deleteManySpy = jest
        .spyOn(prismaService.userMeta, 'deleteMany')
        .mockResolvedValueOnce({ count: 2 });

      jest.spyOn(userHelper, 'createMeta').mockResolvedValueOnce(undefined);

      jest
        .spyOn(emailHelper, 'sendEmailTemplate')
        .mockResolvedValueOnce(undefined);

      const result = await authService.sendConfirmRegisterEmail(
        { email: 'test@example.com' },
        ELanguage.vi,
      );

      expect(deleteManySpy).toHaveBeenCalledWith({
        where: {
          userId: mockUserPrisma.id,
          key: {
            in: [
              userMetaKey.CONFIRM_REGISTER_TOKEN,
              userMetaKey.CONFIRM_REGISTER_CODE,
              userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
            ],
          },
        },
      });

      expect(result).toBe(true);
    });

    it('should delete previous confirmation codes before creating a new one', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(
        mockUserFactory({
          email: 'test@example.com',
          fullname: 'Test User',
          isVerified: false,
        }),
      );

      jest
        .spyOn(prismaService.userMeta, 'deleteMany')
        .mockResolvedValueOnce({ count: 1 });

      jest.spyOn(userHelper, 'createMeta').mockResolvedValueOnce(undefined);

      const result = await authService.sendConfirmRegisterEmail(
        { email: 'test@example.com' },
        ELanguage.vi,
      );
      expect(result).toBe(true);
    });

    it('should generate a new confirmation code each time the function is called', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(
        mockUserFactory({
          email: 'test@example.com',
          fullname: 'Test User',
          isVerified: false,
        }),
      );

      jest.spyOn(userHelper, 'createMeta').mockResolvedValueOnce(undefined);
      const result = await authService.sendConfirmRegisterEmail(
        { email: 'test@example.com' },
        ELanguage.vi,
      );
      expect(result).toBe(true);
    });
  });

  describe('register', () => {
    it('should throw an error if user already exists', async () => {
      const mockUserRegister = {
        email: 'test@example.com',
        password: 'password',
        fullname: 'testuser',
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUserPrisma);

      await expect(
        authService.register(mockUserRegister, ELanguage.vi),
      ).rejects.toThrow(
        new BadRequestException(authError.email_already_exists),
      );
    });

    it('should create a new user and return tokens', async () => {
      const createdUser = {
        id: mockUserPrisma.id,
        email: 'test@example.com',
      } as IUser;
      const mockToken = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(authHelper, 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(userActionService, 'create').mockResolvedValue(createdUser);
      jest.spyOn(authHelper, 'generateToken').mockResolvedValue(mockToken);
      jest
        .spyOn(authService, 'sendConfirmRegisterEmail')
        .mockResolvedValue(true);

      const result = await authService.register(
        {
          email: 'test@example.com',
          password: 'password',
          fullname: 'testuser',
          verifyType: AuthVerifyType.LINK,
        },
        ELanguage.vi,
      );

      expect(result).toEqual({ ...mockToken, user: createdUser });
    });
  });

  describe('confirmRegister', () => {
    it('should throw BadRequestException when token is not provided', async () => {
      await expect(authService.confirmRegister({ token: '' })).rejects.toThrow(
        new BadRequestException(authError.token_required),
      );
    });

    it('should throw BadRequestException when user is not found in the database', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.user_not_found));
    });

    it('should throw BadRequestException if user.isVerified is true', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUserFactory({ isVerified: true }));

      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.user_is_verified));
    });

    it('should throw BadRequestException when user metas do not include CONFIRM_REGISTER_CODE', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUserFactory());

      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.token_invalid));
    });

    it('should throw BadRequestException when code count exceeds the limit (>=5)', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUserFactory());
      jest.spyOn(prismaService.userMeta, 'findFirst').mockResolvedValueOnce({
        id: mockUserPrisma.id,
        userId: mockUserPrisma.id,
        key: userMetaKey.CONFIRM_REGISTER_CODE_COUNT,
        value: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.token_invalid));
    });

    it('should throw BadRequestException when the code has expired (more than 5 minutes)', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUserFactory());

      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.token_invalid));
    });

    it('should throw BadRequestException when the token does not match', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUserFactory());

      await expect(
        authService.confirmRegister({ token: 'valid_token' }),
      ).rejects.toThrow(new BadRequestException(authError.token_invalid));
    });

    it('should succeed when all conditions are met', async () => {
      jest
        .spyOn(authHelper, 'verifyConfirmRegisterToken')
        .mockResolvedValueOnce({
          userId: mockUserPrisma.id,
        });
      const generateTokenSpy = jest
        .spyOn(authHelper, 'generateToken')
        .mockResolvedValueOnce({
          accessToken: 'valid_access_token',
          refreshToken: 'valid_refresh_token',
        });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        ...mockUserPrisma,
        isVerified: false,
        metas: [
          {
            id: 'meta-confirm',
            value: 'valid_token',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      } as unknown as User);

      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(
        mockUserFactory({
          isVerified: true,
          status: 'ACTIVE' as User['status'],
        }),
      );

      jest.spyOn(prismaService.userMeta, 'deleteMany').mockResolvedValueOnce({
        count: 0,
      });

      jest.spyOn(userHelper, 'deleteMeta').mockResolvedValueOnce(1);
      jest.spyOn(userHelper, 'createMeta').mockResolvedValueOnce(undefined);

      const result = await authService.confirmRegister({
        token: 'valid_token',
      });

      expect(result).toEqual({
        accessToken: 'valid_access_token',
        refreshToken: 'valid_refresh_token',
        user: expect.objectContaining({
          id: mockUserPrisma.id,
          email: mockUserPrisma.email,
          isVerified: true,
        }),
      });

      expect(generateTokenSpy).toHaveBeenCalledWith({
        userId: mockUserPrisma.id,
      });
    });
  });
});
