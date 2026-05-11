import { filterXSS, getDefaultWhiteList, escapeAttrValue } from 'xss';
import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

const whiteList = {
  ...getDefaultWhiteList(),
  figure: ['class', 'style'],
  figcaption: ['class', 'style'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  iframe: ['src', 'title', 'width', 'hight'],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTagAttr(tag: any, name: any, val: any) {
    if (tag === 'img' && name === 'src' && val.includes('__ASSETS_URL__')) {
      return `${name}="${escapeAttrValue(val)}"`;
    }
  },
};

@Injectable()
export class XSSFilterPipe implements PipeTransform {
  private readonly logger = new Logger(XSSFilterPipe.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (
        metadata &&
        excludeDto.some((item) => metadata.metatype?.name.includes(item))
      ) {
        return value;
      }
      if (value == null) return value;

      if (typeof value === 'object') {
        for (const [key, val] of Object.entries(value)) {
          if (typeof val === 'string') {
            (value as Record<string, unknown>)[key] = filterXSS(
              val,
              xssOptions,
            ).trim();
          }
        }
      }

      if (typeof value === 'string') {
        return filterXSS(value, xssOptions).trim();
      }

      return value;
    } catch (error) {
      this.logger.error('XSS filter error', error);
      return value;
    }
  }
}
