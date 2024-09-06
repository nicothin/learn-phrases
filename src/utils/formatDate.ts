export function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString.slice(0, -1));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
