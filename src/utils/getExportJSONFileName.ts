interface GetExportFileNameProps {
  prefix?: string;
  contentType?: string;
}

export const getExportJSONFileName = (data: GetExportFileNameProps): string => {
  const { prefix = 'LP', contentType = 'data' } = data;
  const now = new Date();
  return `${prefix}_${contentType}_${window.location.hostname.replace('.', '_')}_${now.toISOString().slice(0, 10)}_${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-')}.json`;
};
