import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ELanguage } from '@seven-auto/libs';

export const Language = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const rawLanguage = (request.headers['accept-language'] ||
      ELanguage.VI) as string;

    const langCode = rawLanguage.split(',')[0].split('-')[0].toLowerCase();

    if (langCode === 'en') {
      return ELanguage.EN;
    }

    return ELanguage.VI;
  },
);
