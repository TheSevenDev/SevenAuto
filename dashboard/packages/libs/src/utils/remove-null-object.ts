export const removeNullObject = <T extends object>(object: T): Partial<T> => {
  const cleaned = { ...object } as Partial<T>;
  for (const key of Object.keys(object) as (keyof T)[]) {
    if (object[key] === null || object[key] === undefined) {
      delete cleaned[key];
    }
  }
  return cleaned;
};
