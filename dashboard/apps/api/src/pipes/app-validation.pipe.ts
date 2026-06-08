import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { applyNormalizeQueryParams } from 'src/transform/normalize-query-params';

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new HttpException(errors, HttpStatus.BAD_REQUEST),
    });
  }

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (
      metadata.type === 'query' &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const query = { ...(value as Record<string, unknown>) };
      applyNormalizeQueryParams(query);
      return super.transform(query, metadata);
    }

    return super.transform(value, metadata);
  }
}
