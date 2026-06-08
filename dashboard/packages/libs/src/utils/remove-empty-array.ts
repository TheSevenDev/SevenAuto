export const removeEmptyArray = <T>(array: T[]): T[] => {
  const newArray: T[] = [];
  for (const key in array) {
    if (array[key]) newArray.push(array[key]);
  }
  return newArray;
};
