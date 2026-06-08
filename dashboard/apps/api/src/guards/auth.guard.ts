import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { authError } from 'src/messages/auth.message';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // is handle in middleware
    // const accessToken = request.headers['authorization'];
    // if (accessToken) {
    //   try {
    //     const user = await this.authService.getMe(accessToken);
    //     request.user = user;
    //   } catch (error) {
    //     request.user = null;
    //   }
    // }

    if (!request.user || !request.user.id)
      throw new HttpException(authError.user_error, HttpStatus.UNAUTHORIZED);
    if (request.user.id === '1') return true;
    return true;
  }
}
