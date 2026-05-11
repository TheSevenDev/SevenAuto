import { IUser } from '@seven-auto/libs';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(
    req: Request & { user?: IUser | null },
    _res: Response,
    next: NextFunction,
  ): void {
    if (req.user) {
      next();
      return;
    }
    const auth = req.headers.authorization;
    if (auth) {
      // Wire AuthModule + JWT/session validation here when available.
      req.user = null;
    }
    next();
  }
}
