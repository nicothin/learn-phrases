const pad = (n: number): string => String(n).padStart(2, '0');

export const formatTimestamp = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}_${hours}-${minutes}`;
};
