import { transformBoolean } from './transform.boolean';
import { transformObject } from './transform.object';

export const transformArray = (
  value: string | unknown[] | null,
  type: 'boolean' | 'number' | 'string' | 'object' | 'array' = 'string',
): unknown[] => {
  if (!value) return [];
  let newValue = value;
  if (typeof value === 'string') {
    try {
      newValue = JSON.parse(value || '[]');
    } catch {
      newValue = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  if (Array.isArray(newValue)) {
    switch (type) {
      case 'boolean':
        return newValue.map((item) =>
          transformBoolean(item as string | boolean | number),
        );

      case 'number':
        return newValue.map((item) => parseFloat(item as string));

      case 'string':
        return newValue.map((el) => el.toString());

      case 'object':
        return newValue.map((item) =>
          transformObject(item as string | object | null),
        );

      case 'array':
        return newValue.map((item) =>
          transformArray(item as string | unknown[] | null, type),
        );

      default:
        return newValue;
    }
  }
  return [];
};
