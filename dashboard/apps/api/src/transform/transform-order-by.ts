import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';

export type IOrderBy = {
  [key: string]: Prisma.SortOrder;
};

export const DEFAULT_ORDER_BY: IOrderBy = { createdAt: 'desc' };

const isSortOrder = (value: unknown): value is Prisma.SortOrder =>
  value === 'asc' || value === 'desc';

export const normalizeSortOrder = (
  value: unknown,
): Prisma.SortOrder | undefined => {
  if (typeof value !== 'string') return undefined;
  const direction = value.toLowerCase();
  return isSortOrder(direction) ? direction : undefined;
};

const parseOrderByObject = (value: Record<string, unknown>): IOrderBy => {
  const orderBy: IOrderBy = {};
  for (const [field, direction] of Object.entries(value)) {
    const sort = normalizeSortOrder(direction);
    if (sort) {
      orderBy[field] = sort;
    }
  }
  return orderBy;
};

const parseOrderByString = (value: string): IOrderBy | undefined => {
  const separator = value.lastIndexOf('_');
  if (separator <= 0) return undefined;

  const field = value.slice(0, separator);
  const direction = normalizeSortOrder(value.slice(separator + 1));
  if (!field || !direction) return undefined;

  return { [field]: direction };
};

export const transformOrderBy = (
  value: unknown,
  fallback: IOrderBy = DEFAULT_ORDER_BY,
): IOrderBy => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const orderBy = parseOrderByObject(value as Record<string, unknown>);
    if (Object.keys(orderBy).length > 0) {
      return orderBy;
    }
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = parseOrderByString(value.trim());
    if (parsed) {
      return parsed;
    }
  }

  return { ...fallback };
};

/** Query DTO decorator: supports `orderBy[field]=asc` (via AppValidationPipe) and `field_desc` strings. */
export function OrderByQuery(
  fallback: IOrderBy = DEFAULT_ORDER_BY,
): PropertyDecorator {
  return applyDecorators(
    IsObject(),
    IsOptional(),
    ApiProperty({
      type: 'string',
      example: `${Object.keys(fallback)[0]}_desc`,
      required: false,
    }),
    Transform(({ value }) => transformOrderBy(value, fallback)),
  );
}
