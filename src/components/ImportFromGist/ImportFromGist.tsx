import { ReactNode, useState } from 'react';

import { useActionsContext, useNotificationContext } from '../../hooks';
import { getAllPhrasesFromAllPhrasesDTO } from '../../services';
import { STATUS } from '../../enums';

interface ImportFromGistProps {
  className?: string;
  classNameLoading?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const MAIN_USER_ID = 1;

export function ImportFromGist(data: ImportFromGistProps) {
  const { children, className = '', classNameLoading = '', style } = data;

  const { getPhrasesDTOFromGist, setPhrasesToResolveConflicts } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const [isLoading, setIsLoading] = useState(false);

  const onImportPhrases = () => {
    setIsLoading(true);

    getPhrasesDTOFromGist(MAIN_USER_ID)
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
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <button
      className={`import-from-gist ${className} ${isLoading && classNameLoading ? classNameLoading : ''}`}
      style={style ?? undefined}
      title="Import phrases from gist"
      type="button"
      onClick={onImportPhrases}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
