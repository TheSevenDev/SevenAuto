import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeaders = request.headers['authorization'];
    return authHeaders?.replace('Bearer ', '');
  },
);
