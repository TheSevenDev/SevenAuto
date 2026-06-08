import { Injectable, NestMiddleware } from '@nestjs/common';
import { IUser } from '@seven-auto/libs';
import { NextFunction, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: Request & { user: IUser },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (req.user) return next();
    const accessToken = req.headers['authorization'];
    if (accessToken) {
      try {
        const user = await this.authService.getMe(accessToken);
        req.user = user;
      } catch {
        req.user = null;
      }
    }
    next();
  }
}
