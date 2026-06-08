import { normalizeSortOrder } from './transform-order-by';

const ORDER_BY_BRACKET_RE = /^orderBy\[([^\]]+)\]$/i;
const ARRAY_BRACKET_RE = /^(.+)\[\]$/i;
const ARRAY_INDEX_BRACKET_RE = /^(.+)\[\d+\]$/i;

function appendQueryArray(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  const items = Array.isArray(value) ? value : [value];
  const existing = target[key];
  if (existing === undefined) {
    target[key] = items.length === 1 ? items[0] : items;
    return;
  }
  const existingItems = Array.isArray(existing) ? existing : [existing];
  target[key] = [...existingItems, ...items];
}

/** Merge `orderBy[field]=asc` flat keys into `orderBy` on a plain query object. */
export function applyNormalizeQueryParams(
  query: Record<string, unknown>,
): void {
  const orderBy: Record<string, unknown> = {};

  if (
    query.orderBy &&
    typeof query.orderBy === 'object' &&
    !Array.isArray(query.orderBy)
  ) {
    for (const [field, direction] of Object.entries(
      query.orderBy as Record<string, unknown>,
    )) {
      const sort = normalizeSortOrder(direction);
      if (sort) {
        orderBy[field] = sort;
      }
    }
  }

  const bracketKeys: string[] = [];
  for (const key of Object.keys(query)) {
    const match = ORDER_BY_BRACKET_RE.exec(key);
    if (!match) continue;

    const sort = normalizeSortOrder(query[key]);
    if (sort) {
      orderBy[match[1]] = sort;
    }
    bracketKeys.push(key);
  }

  for (const key of bracketKeys) {
    delete query[key];
  }

  if (Object.keys(orderBy).length > 0) {
    query.orderBy = orderBy;
  }

  normalizeArrayBracketQueryParams(query);
}

function normalizeArrayBracketQueryParams(
  query: Record<string, unknown>,
): void {
  const keysToDelete: string[] = [];

  for (const key of Object.keys(query)) {
    const emptyBracket = ARRAY_BRACKET_RE.exec(key);
    const indexBracket = ARRAY_INDEX_BRACKET_RE.exec(key);
    const baseKey = emptyBracket?.[1] ?? indexBracket?.[1];
    if (!baseKey) continue;

    appendQueryArray(query, baseKey, query[key]);
    keysToDelete.push(key);
  }

  for (const key of keysToDelete) {
    delete query[key];
  }
}
