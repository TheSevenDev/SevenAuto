import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

const EXCLUDE_PATHS = ['pdf'];

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const { url } = context.switchToHttp().getRequest<{ url: string }>();
    if (EXCLUDE_PATHS.some((path) => url.includes(path))) {
      return next.handle();
    }
    return next.handle().pipe(map((data) => ({ data })));
  }
}
