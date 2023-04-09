export const checkString = (str: string): boolean =>
  str !== null && str !== undefined && typeof str === 'string' && str.length > 0;
