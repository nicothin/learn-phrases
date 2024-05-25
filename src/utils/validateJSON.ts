export const validateJSON = (_: unknown, value: string) => {
  try {
    JSON.parse(value);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(new Error(`Not saved! ${String(err)}`));
  }
};
