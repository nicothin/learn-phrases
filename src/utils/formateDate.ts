export const formatDate = (date: Date): string => {
  let dd: string | number = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm: string | number = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy: string | number = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  let hr: string | number = date.getHours();
  if (hr < 10) hr = `0${hr}`;

  let mi: string | number = date.getMinutes();
  if (mi < 10) mi = `0${mi}`;

  return `${yy}-${mm}-${dd}_${hr}-${mi}`;
};
