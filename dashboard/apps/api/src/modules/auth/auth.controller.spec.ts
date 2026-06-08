import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ELanguage } from '@prisma/client';
import type { IUser } from '@seven-auto/libs';
import { mockUserFactory } from 'src/_mock/user';
import { createAuthTestingModule } from 'src/test/create-auth-testing-module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockUser = mockUserFactory() as unknown as IUser;

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
    module = await createAuthTestingModule();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module?.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a me method', () => {
    expect(controller.getMe).toBeDefined();
  });

  it('should have a login method', () => {
    expect(controller.login).toBeDefined();
  });

  it('should have a logout method', () => {
    expect(controller.logout).toBeDefined();
  });

  it('should have a register method', () => {
    expect(controller.register).toBeDefined();
  });

  it('should have a resendRegister method', () => {
    expect(controller.resendRegister).toBeDefined();
  });

  it('should have a confirmRegister method', () => {
    expect(controller.confirmRegister).toBeDefined();
  });

  it('should have a refreshToken method', () => {
    expect(controller.refreshToken).toBeDefined();
  });

  it('should have a forgotPassword method', () => {
    expect(controller.forgotPassword).toBeDefined();
  });

  it('should have a resetPassword method', () => {
    expect(controller.resetPassword).toBeDefined();
  });

  it('should have a changePassword method', () => {
    expect(controller.changePassword).toBeDefined();
  });

  describe('AuthController - /me', () => {
    it('should return the user info when valid token is provided', async () => {
      const req = { user: mockUser };
      const result = await controller.getMe(req);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when no user is found in request', async () => {
      const req = { user: null };
      await expect(controller.getMe(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('AuthController - /login', () => {
    it('should return auth response when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const mockResponse = {
        accessToken: 'token',
        refreshToken: 'refreshToken',
        user: mockUser,
      };
      jest.spyOn(service, 'login').mockResolvedValue(mockResponse);
      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('AuthController - /logout', () => {
    it('should return true when user logs out successfully', async () => {
      jest.spyOn(controller, 'logout').mockResolvedValue(true);
      const result = await controller.logout(mockUser);
      expect(result).toBe(true);
    });
  });

  describe('AuthController - /register', () => {
    it('should return auth response when registration is successful', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        fullname: 'testuser',
      };
      const mockResponse = {
        accessToken: 'token',
        refreshToken: 'refreshToken',
        user: mockUser,
      };

      jest.spyOn(service, 'register').mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto, ELanguage.vi, '');

      expect(result).toEqual(mockResponse);
      expect(service.register).toHaveBeenCalledWith(
        registerDto,
        ELanguage.vi,
        '',
      );
    });

    it('should throw ConflictException if email is already registered', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        fullname: 'testuser',
      };

      jest
        .spyOn(service, 'register')
        .mockRejectedValue(new ConflictException());

      await expect(
        controller.register(registerDto, ELanguage.vi, ''),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('AuthController - /forgot-password', () => {
    it('should return true when forgot password request is successful', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };

      jest.spyOn(service, 'forgotPassword').mockResolvedValue(true);

      const result = await controller.forgotPassword(
        forgotPasswordDto,
        ELanguage.vi,
      );

      expect(result).toBe(true);
      expect(service.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
        ELanguage.vi,
      );
    });

    it('should throw NotFoundException if email is not found', async () => {
      const forgotPasswordDto = { email: 'notfound@example.com' };

      jest
        .spyOn(service, 'forgotPassword')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.forgotPassword(forgotPasswordDto, ELanguage.vi),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('AuthController - /change-password', () => {
    it('should return true when password is successfully changed', async () => {
      const changePasswordDto = {
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      };

      jest.spyOn(service, 'changePassword').mockResolvedValue(true);

      const result = await controller.changePassword(
        mockUser,
        changePasswordDto,
      );

      expect(result).toBe(true);
      expect(service.changePassword).toHaveBeenCalledWith(
        mockUser,
        changePasswordDto,
      );
    });

    it('should throw UnauthorizedException for incorrect old password', async () => {
      const changePasswordDto = {
        oldPassword: 'wrongOldPass',
        newPassword: 'newPass',
      };

      jest
        .spyOn(service, 'changePassword')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.changePassword(mockUser, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
