import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ELanguage } from '@prisma/client';
import type { IAuthResponse, IUser } from '@seven-auto/libs';
import { permissions } from '@seven-auto/libs';
import { AffiliateSession } from 'src/decorators/affiliate-session';
import {
  ApiErrorResponse,
  ApiSuccessBooleanResponse,
  ApiSuccessObjResponse,
} from 'src/decorators/apiResponse.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Language } from 'src/decorators/language.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { EmailRequireDto } from 'src/dto/utils.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDto } from 'src/modules/user/dto/user.dto';

import {
  AuthChangePasswordDto,
  AuthConfirmRegisterCodeDto,
  AuthConfirmRegisterDto,
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRefreshTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  AuthResponseDto,
  AuthSendRegisterDto,
} from './auth.dto';
import { AuthService } from './auth.service';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @ApiBearerAuth()
  @ApiSuccessObjResponse(UserDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Get Me' })
  @UseGuards(AuthGuard)
  async getMe(@Req() req: { user: IUser }): Promise<IUser> {
    if (req && req.user && req.user.id) return req.user;
    throw new UnauthorizedException();
  }

  @Post('/login')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Log In application' })
  async login(@Body() args: AuthLoginDto): Promise<IAuthResponse> {
    return this.authService.login(args);
  }

  @Post('/login-by-admin')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @Permissions(permissions.USER_MANAGE)
  @ApiOperation({ summary: 'Log In application' })
  async loginByAdmin(
    @Body() args: EmailRequireDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IAuthResponse> {
    return this.authService.loginByAdmin(args, currentUser);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiSuccessBooleanResponse()
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Log Out application' })
  async logout(@CurrentUser() user: IUser): Promise<boolean> {
    return this.authService.logout(user);
  }

  @Post('/register')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Register application' })
  async register(
    @Body() args: AuthRegisterDto,
    @Language() lang: ELanguage,
    @AffiliateSession() affiliateSessionId: string,
  ): Promise<IAuthResponse> {
    return this.authService.register(args, lang, affiliateSessionId);
  }

  @Post('/resend-register')
  @ApiSuccessBooleanResponse()
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Resend Register application' })
  async resendRegister(
    @Body() args: AuthSendRegisterDto,
    @Language() lang: ELanguage,
  ): Promise<boolean> {
    return this.authService.sendConfirmRegisterEmail(args, lang);
  }

  @Post('/confirm-register')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Confirm Register application' })
  async confirmRegister(
    @Body() args: AuthConfirmRegisterDto,
  ): Promise<IAuthResponse> {
    return this.authService.confirmRegister(args);
  }

  @Post('/confirm-register-code')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Confirm Register application with code' })
  async confirmRegisterCode(
    @Body() args: AuthConfirmRegisterCodeDto,
  ): Promise<IAuthResponse> {
    return this.authService.confirmRegisterCode(args);
  }

  @Post('/refresh-token')
  @ApiSuccessObjResponse(AuthResponseDto)
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Refresh Token application' })
  async refreshToken(
    @Body() args: AuthRefreshTokenDto,
  ): Promise<IAuthResponse> {
    return this.authService.refreshToken(args);
  }

  @Post('/forgot-password')
  @ApiSuccessBooleanResponse()
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Forgot Password application' })
  async forgotPassword(
    @Body() args: AuthForgotPasswordDto,
    @Language() lang: ELanguage,
  ): Promise<boolean> {
    return this.authService.forgotPassword(args, lang);
  }

  @Post('/reset-password')
  @ApiSuccessBooleanResponse()
  @ApiErrorResponse()
  @ApiOperation({ summary: 'Reset Password application' })
  async resetPassword(@Body() args: AuthResetPasswordDto): Promise<boolean> {
    return this.authService.resetPassword(args);
  }

  @Post('/change-password')
  @ApiSuccessBooleanResponse()
  @ApiErrorResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change Password application' })
  async changePassword(
    @CurrentUser() user: IUser,
    @Body() args: AuthChangePasswordDto,
  ): Promise<boolean> {
    return this.authService.changePassword(user, args);
  }
}
