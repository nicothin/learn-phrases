import { ReactNode } from 'react';

import { useMainContext, useNotificationContext } from '../../hooks';
import { getAllPhrasesFromAllPhrasesDTO } from '../../services';
import { STATUS } from '../../enums';

interface ImportFromGistButtonProps {
  className?: string;
  classNameLoading?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const MAIN_USER_ID = 1;

export function ImportFromGistButton(data: ImportFromGistButtonProps) {
  const { children, className = '', classNameLoading = '', style } = data;

  const {
    importPhrasesDTOFromGist,
    setPhrasesToResolveConflicts,
    isDataExchangeWithGist,
    isImportingDataFromGist,
  } = useMainContext();
  const { addNotification } = useNotificationContext();

  const onImportPhrases = () => {
    importPhrasesDTOFromGist(MAIN_USER_ID)
      .then((result) => {
        addNotification(result.notification);
        const conversion = getAllPhrasesFromAllPhrasesDTO(result.payload);
        if (conversion.notification.type === STATUS.ERROR) {
          addNotification(conversion.notification);
        }
        setPhrasesToResolveConflicts(conversion.phrases);
      })
      .catch((result) => {
        addNotification(result.notification);
      });
  };

  return (
    <button
      className={`import-from-gist-button ${className} ${isImportingDataFromGist && classNameLoading ? classNameLoading : ''}`}
      style={style ?? undefined}
      title="Import phrases from gist"
      type="button"
      onClick={onImportPhrases}
      disabled={isDataExchangeWithGist}
    >
      {children}
    </button>
  );
}
