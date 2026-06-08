import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AffiliateSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const affiliateSession = request.headers['x-affiliate-session'] as string;
    return affiliateSession || undefined;
  },
);
