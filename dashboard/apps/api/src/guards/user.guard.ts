import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user) return true;
    const accessToken = request.headers['authorization'];
    if (accessToken) {
      try {
        const user = await this.authService.getMe(accessToken);
        request.user = user;
      } catch {
        request.user = null;
      }
    }

    return true;
  }
}
