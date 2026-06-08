import { ApiProperty } from '@nestjs/swagger';
import {
  AuthVerifyType,
  IAuthChangePassword,
  IAuthConfirmRegister,
  IAuthConfirmRegisterCode,
  IAuthForgotPassword,
  IAuthLogin,
  IAuthRefreshToken,
  IAuthRegister,
  IAuthResetPassword,
  IAuthResponse,
  IAuthSendRegister,
} from '@seven-auto/libs';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmailRequireDto } from 'src/dto/utils.dto';
import { authError } from 'src/messages/auth.message';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class AuthLoginDto extends EmailRequireDto implements IAuthLogin {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Ab!123456',
    required: true,
  })
  @IsNotEmpty({ message: authError.password_required })
  password: string;
}

export class AuthRefreshTokenDto implements IAuthRefreshToken {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.refresh_token_required })
  refreshToken: string;
}

export class AuthForgotPasswordDto implements IAuthForgotPassword {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    required: true,
  })
  @IsNotEmpty({ message: authError.email_required })
  email: string;
}

export class AuthResetPasswordDto implements IAuthResetPassword {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.token_required })
  token: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.password_required })
  password: string;
}

export class AuthChangePasswordDto implements IAuthChangePassword {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.old_password_required })
  oldPassword: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.new_password_required })
  newPassword: string;
}

export class AuthRegisterDto implements IAuthRegister {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({ message: authError.fullname_required })
  fullname: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    required: true,
  })
  @IsNotEmpty({ message: authError.email_required })
  email: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.password_required })
  password: string;

  @ApiProperty({
    enum: AuthVerifyType,
    example: AuthVerifyType.LINK,
    enumName: 'AuthVerifyType',
    required: false,
  })
  @IsOptional()
  @IsString()
  verifyType?: AuthVerifyType = AuthVerifyType.LINK;

  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsOptional()
  @IsString()
  referrerId?: string;
}

export class AuthConfirmRegisterDto implements IAuthConfirmRegister {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.token_required })
  token: string;
}

export class AuthResponseDto implements IAuthResponse {
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  refreshToken: string;

  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;
}

export class AuthConfirmRegisterCodeDto
  extends EmailRequireDto
  implements IAuthConfirmRegisterCode
{
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: authError.code_required })
  code: string;
}

export class AuthSendRegisterDto
  extends EmailRequireDto
  implements IAuthSendRegister
{
  @ApiProperty({
    enum: AuthVerifyType,
    example: AuthVerifyType.LINK,
    enumName: 'AuthVerifyType',
    required: false,
  })
  @IsOptional()
  @IsString()
  verifyType?: AuthVerifyType = AuthVerifyType.LINK;
}
