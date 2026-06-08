import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { IAuthInfoToken, IAuthResponse } from '@seven-auto/libs';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { authError } from 'src/messages/auth.message';

import { EnvService } from '../env/env.service';

@Global()
@Injectable()
export class AuthHelperService {
  constructor(private readonly env: EnvService) {}

  async verifyToken(token: string): Promise<IAuthInfoToken> {
    try {
      const decoded: IAuthInfoToken = verify(
        token.replace('Bearer ', ''),
        this.env.APP_SECRET,
      );
      if (decoded) return decoded;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async signToken(payload, expiresIn): Promise<string> {
    //3. Generate the JWT Token
    const token = sign(payload, this.env.APP_SECRET, { expiresIn });
    return token;
  }

  async verifyAccessToken(token: string): Promise<IAuthInfoToken> {
    try {
      if (!token) return;
      const decoded: IAuthInfoToken = verify(
        token.replace('Bearer ', ''),
        this.env.APP_SECRET,
      );
      if (decoded && decoded.userId) return decoded;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async signAccessToken(data: IAuthInfoToken): Promise<string> {
    //3. Generate the JWT Token
    const token = sign({ ...data }, this.env.APP_SECRET, {
      expiresIn: this.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    return token;
  }

  async verifyRefreshToken(token: string): Promise<IAuthInfoToken> {
    try {
      const decoded: IAuthInfoToken = verify(
        token.replace('Bearer ', ''),
        `${this.env.APP_SECRET}_refresh`,
      );
      if (decoded && decoded.userId) return decoded;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async signRefreshToken(data: IAuthInfoToken): Promise<string> {
    //3. Generate the JWT Token
    const token = sign({ ...data }, `${this.env.APP_SECRET}_refresh`, {
      expiresIn: this.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    return token;
  }

  async generateToken({
    userId,
  }: {
    userId: string;
  }): Promise<Omit<IAuthResponse, 'user'>> {
    try {
      //3. Generate the JWT Token
      const accessToken = await this.signAccessToken({ userId });
      const refreshToken = await this.signRefreshToken({ userId });
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async comparePassword(password: string, dbPassword: string): Promise<void> {
    const valid = await compare(password, dbPassword || '');
    if (!valid) throw new BadRequestException(authError.password_is_incorrect);
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async generateForgotPasswordToken({
    userId,
  }: {
    userId: string;
  }): Promise<string> {
    try {
      //3. Generate the JWT Token
      const token = sign({ userId }, `${this.env.APP_SECRET}_forgot_pass`, {
        expiresIn: '1h',
      });
      return token;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async verifyForgotPasswordToken(token: string): Promise<IAuthInfoToken> {
    try {
      const decoded: IAuthInfoToken = verify(
        token.replace('Bearer ', ''),
        `${this.env.APP_SECRET}_forgot_pass`,
      );
      if (decoded && decoded.userId) return decoded;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async generateConfirmRegisterToken({
    userId,
  }: {
    userId: string;
  }): Promise<string> {
    try {
      //3. Generate the JWT Token
      const token = sign(
        { userId },
        `${this.env.APP_SECRET}_confirm_register`,
        {
          expiresIn: this.env.VERIFY_TOKEN_EXPIRE_TIME,
        },
      );
      return token;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }

  async verifyConfirmRegisterToken(token: string): Promise<IAuthInfoToken> {
    try {
      const decoded: IAuthInfoToken = verify(
        token.replace('Bearer ', ''),
        `${this.env.APP_SECRET}_confirm_register`,
      );
      if (decoded && decoded.userId) return decoded;
    } catch (error) {
      if (error instanceof Error) {
        handleJWTErrors(error);
      } else {
        throw new BadRequestException(authError.token_invalid);
      }
    }
  }
}

const handleJWTErrors = (error: Error) => {
  if (error.name === 'TokenExpiredError') {
    throw new BadRequestException(authError.token_expired);
  } else if (error.name === 'JsonWebTokenError') {
    throw new BadRequestException(authError.token_invalid);
  } else {
    throw new BadRequestException(error.message);
  }
};
