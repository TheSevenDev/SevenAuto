import { removeNullObject } from './remove-null-object';

/**
 * Prepares query params for API requests: drops null/undefined and serializes
 * arrays as comma-separated strings (avoids axios `key[]=value` bracket notation).
 */
export const prepareQueryParams = (
  params?: Record<string, unknown>,
): Record<string, unknown> => {
  if (!params) return {};

  const cleaned = removeNullObject(params) as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(cleaned)) {
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      result[key] = value.join(',');
      continue;
    }
    result[key] = value;
  }

  return result;
};
