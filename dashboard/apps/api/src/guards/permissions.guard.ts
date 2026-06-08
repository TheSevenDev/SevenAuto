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

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const levels = this.reflector.get<string[]>('levels', context.getHandler());

    if (!permissions && !levels) {
      throw new BadRequestException(permissionError.permission_error);
    }

    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    if (!user || !user.id)
      throw new HttpException(authError.user_error, HttpStatus.UNAUTHORIZED);

    if (user.id === '1') return true;

    if (levels && levels.length > 0) {
      const userLevel = user?.level as EUserLevel;

      if (!userLevel) {
        throw new HttpException(
          permissionError.permission_error,
          HttpStatus.FORBIDDEN,
        );
      }

      const hasLevel = () => {
        return levels.includes(userLevel);
      };

      return hasLevel();
    }

    const userPermissions = user?.role?.permissions;

    if (!userPermissions || userPermissions.length === 0) {
      throw new HttpException(
        permissionError.permission_error,
        HttpStatus.FORBIDDEN,
      );
    }

    const hasPermission = () => {
      return userPermissions.some((permission) =>
        permissions.includes(permission),
      );
    };

    return hasPermission();
  }
}
