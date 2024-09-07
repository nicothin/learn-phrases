import { ChangeEvent } from 'react';

import './ImportFromFileButton.css';

import { STATUS } from '../../enums';
import { useActionsContext, useNotificationContext } from '../../hooks';
import { getAllPhrasesFromAllPhrasesDTO } from '../../services';

interface ImportFromFileButtonProps {
  className?: string;
  children?: string;
}

export const ImportFromFileButton = (data: ImportFromFileButtonProps) => {
  const { className, children } = data;
  const { setPhrasesToResolveConflicts } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);

        const conversion = getAllPhrasesFromAllPhrasesDTO(jsonData);

        if (conversion.notification.type === STATUS.ERROR) {
          addNotification(conversion.notification);
        }
        setPhrasesToResolveConflicts(conversion.phrases);
      } catch (error) {
        console.error(error);
        addNotification({
          text: `Invalid JSON: ${error}`,
          type: STATUS.ERROR,
        });
      }
    };

    reader.onerror = () => {
      console.error('File reading error');
    };

    reader.readAsText(file);
  };

  return (
    <label className={`import-from-file-button ${className ?? ''}`}>
      <input
        className="import-from-file-button__input"
        type="file"
        accept=".json, application/json"
        onChange={onFileChange}
      />
      <span className="import-from-file-button__text">{children ?? 'Import phrases from file'}</span>
    </label>
  );
};
