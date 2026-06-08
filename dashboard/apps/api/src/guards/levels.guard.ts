import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserLevel, IUser } from '@seven-auto/libs';
import { authError } from 'src/messages/auth.message';
import { permissionError } from 'src/messages/premission.message';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class LevelsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const types = this.reflector.get<string[]>('types', context.getHandler());
    if (!types) {
      throw new BadRequestException(permissionError.permission_error);
    }

    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    if (!user || !user.id)
      throw new HttpException(authError.user_error, HttpStatus.UNAUTHORIZED);

    if (user.id === '1') return true;
    const userLevel = user?.level as EUserLevel;

    if (!userLevel) {
      throw new HttpException(
        permissionError.permission_error,
        HttpStatus.FORBIDDEN,
      );
    }

    const hasLevel = () => {
      return types.includes(userLevel);
    };

    return hasLevel();
  }
}
