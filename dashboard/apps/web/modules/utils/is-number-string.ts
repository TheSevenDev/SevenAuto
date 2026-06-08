export function isNumberString(value: string | number | null): boolean {
  if (value === null) return false;

  if (typeof value === 'number') return true;

  if (typeof value !== 'string') return false;

  const trimmed = value.trim();

  const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

  return numberRegex.test(trimmed);
}
