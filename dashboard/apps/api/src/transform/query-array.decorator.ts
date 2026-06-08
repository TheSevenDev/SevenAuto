import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

import { transformArray } from './transform.array';

type QueryArrayValueType = 'boolean' | 'number' | 'string' | 'object' | 'array';

/** Query param array: supports `key=1,2`, `key[]=1`, `key[0]=1`, and repeated `key`. */
export function QueryArrayParam(valueType: QueryArrayValueType = 'string') {
  return applyDecorators(
    IsOptional(),
    IsArray(),
    Transform(({ value }) => transformArray(value, valueType)),
    ApiPropertyOptional({ isArray: true }),
  );
}
