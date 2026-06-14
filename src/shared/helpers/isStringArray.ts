export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v): v is string => typeof v === 'string');
