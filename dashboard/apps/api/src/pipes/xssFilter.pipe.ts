/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { escapeAttrValue, filterXSS, getDefaultWhiteList } from 'xss';

const whiteList = {
  ...getDefaultWhiteList(),
  figure: ['class', 'style'],
  figcaption: ['class', 'style'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  iframe: ['src', 'title', 'width', 'height'],
  oembed: ['url'],
};

const excludeDto = [
  'PostCreateDto',
  'PostUpdateDto',
  'LessonCreateDto',
  'LessonUpdateDto',
  'PostCreateWithThirdPartyDto',
  'EmailTemplateUpdateDto',
];

const xssOptions = {
  whiteList,
  stripIgnoreTagBody: true,
  stripIgnoreTag: true,
  onTagAttr(tag: any, name: any, val: any) {
    if (tag === 'img' && name === 'src' && val.includes('__ASSETS_URL__')) {
      return `${name}="${escapeAttrValue(val)}"`;
    }
  },
};

const cleanXSS = (val: any): any => {
  if (val == null) return val;
  if (typeof val === 'string') {
    return filterXSS(val, xssOptions).trim();
  }
  if (Array.isArray(val)) {
    return val.map((item) => cleanXSS(item));
  }
  if (typeof val === 'object') {
    const proto = Object.getPrototypeOf(val);
    if (proto === null || proto === Object.prototype) {
      const cleanObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(val)) {
        cleanObj[key] = cleanXSS(value);
      }
      return cleanObj;
    }
  }
  return val;
};

@Injectable()
export class XSSFilterPipe implements PipeTransform {
  private readonly logger = new Logger(XSSFilterPipe.name);

  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (
        metadata &&
        excludeDto.some((item) => metadata.metatype?.name.includes(item))
      ) {
        return value;
      }
      return cleanXSS(value);
    } catch (error) {
      this.logger.error('XSS filter error', error);
      return value;
    }
  }
}
