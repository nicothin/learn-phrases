import { useStore } from '../store';
import type { ExportData } from '../../types';
import { version } from '../../../package.json';
import { formatTimestamp } from './helpers/formatTimestamp';

const getExportJson = (): string => {
  const { meanings, phrases } = useStore.getState();

  const data: ExportData = {
    meta: { version },
    meanings: Object.values(meanings),
    phrases: Object.values(phrases),
  };

  return JSON.stringify(data, null, 2);
};

const exportDB = () => {
  const json = getExportJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = formatTimestamp(new Date());
  const filename = `learn-phrases_${timestamp}.json`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

export { exportDB, getExportJson };
