import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RequireIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any) {
    if (!value)
      throw new HttpException('Id is required', HttpStatus.BAD_REQUEST);
    return value;
  }
}
