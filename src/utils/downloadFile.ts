export const downloadFile = (filename: string, text: string) => {
  const tempElement = document.createElement('a');
  tempElement.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  tempElement.setAttribute('download', filename);
  tempElement.style.display = 'none';
  document.body.appendChild(tempElement);

  tempElement.click();

  document.body.removeChild(tempElement);
};
