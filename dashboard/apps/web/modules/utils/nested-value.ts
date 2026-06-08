// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNestedObjectValue = (obj: any, path: string) =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);
