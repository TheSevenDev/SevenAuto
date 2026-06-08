import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@seven-auto/libs';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
