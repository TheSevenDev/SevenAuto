export const transformObject = (
  value: string | object | null,
): object | null => {
  if (!value) return null;
  if (typeof value === 'object' && value !== null) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
};
