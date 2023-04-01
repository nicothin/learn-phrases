export const formatDate = (date) => {

  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  let hr = date.getHours();
  if (hr < 10) hr = '0' + hr;

  let mi = date.getMinutes();
  if (mi < 10) mi = '0' + mi;

  return `${yy}-${mm}-${dd}_${hr}-${mi}`;
}
