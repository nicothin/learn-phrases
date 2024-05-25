export const arrayToString = (array: Record<string, unknown>[]): string => {
  const result = array
    .map((obj) => {
      let mergedFields = '';
      for (const key in obj) {
        mergedFields += `"${key}": "${obj[key]}", `;
      }
      return `  { ${mergedFields.slice(0, -2)} }`;
    })
    .join(',\n');

  return `[\n${result}\n]`;
};
