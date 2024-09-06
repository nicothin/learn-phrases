import { ChangeEvent } from 'react';

import './ImportButton.css';

import { STATUS } from '../../enums';
import { useActionsContext, useNotificationContext } from '../../hooks';
import { getAllPhrasesFromAllPhrasesDTO } from '../../services';

interface ImportButtonProps {
  className?: string;
  suffix?: string;
}

export const ImportButton = (data: ImportButtonProps) => {
  const { className, suffix } = data;
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
      }
      catch (error) {
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
    <span className={`import-button ${className ?? ''}`}>
      <input
        className="import-button__input"
        type="file"
        accept=".json, application/json"
        onChange={onFileChange}
      />
      <span className="import-button__text">
        Import phrases from file
        {suffix && ` ${suffix}`}
        </span>
    </span>
  );
}
