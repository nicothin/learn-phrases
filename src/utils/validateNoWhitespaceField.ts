export const validateNoWhitespaceField = (_: unknown, value: string): Promise<void> => {
  if (/\s/.test(value.trim())) {
    return Promise.reject(new Error('This field cannot contain spaces'));
  }
  return Promise.resolve();
};
