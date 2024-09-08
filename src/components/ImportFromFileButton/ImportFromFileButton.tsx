import { ChangeEvent } from 'react';

import './ImportFromFileButton.css';

import { useMainContext, useNotificationContext } from '../../hooks';

interface ImportFromFileButtonProps {
  className?: string;
  children?: string;
}

export const ImportFromFileButton = (data: ImportFromFileButtonProps) => {
  const { className, children } = data;
  const { importPhrasesDTOFromFile } = useMainContext();
  const { addNotification } = useNotificationContext();

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    importPhrasesDTOFromFile(event).catch((result) => addNotification(result));
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
