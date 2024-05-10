type GetDateOptions = {
  divider?: string;
  timeDivider?: string;
  addTime?: boolean;
};

export const getDate = (value?: unknown, options?: GetDateOptions): string => {
  const { divider = '.', addTime, timeDivider = '_' } = options ?? {};

  const now = new Date();
  let date = now;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'string') {
    const parsedDate = Date.parse(value);
    if (!isNaN(parsedDate)) {
      date = new Date(parsedDate);
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let timeString = '';

  if (addTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    timeString = `${timeDivider}${hours}-${minutes}`;
  }

  return `${year}${divider}${month}${divider}${day}${timeString}`;
};
