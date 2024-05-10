export const hasNotEmptyStringProperty = (obj: unknown, propName: string): boolean => {
  if (typeof obj !== 'object' || obj === null || !propName || typeof propName !== 'string') {
    return false;
  }

  const value = (obj as Record<string, unknown>)[propName];

  return typeof value === 'string' && value.trim().length > 0;
};
