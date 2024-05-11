export const getStringOrEmpty = (value: unknown): string =>
  typeof value === 'string' ? value : '';
