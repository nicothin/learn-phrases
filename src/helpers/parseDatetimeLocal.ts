export const parseDatetimeLocal = (str: string): number => {
  const [datePart, timePart] = str.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes).getTime();
};
