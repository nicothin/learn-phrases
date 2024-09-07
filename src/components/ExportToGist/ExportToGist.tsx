import { ReactNode, useState } from 'react';

import { useActionsContext, useNotificationContext } from '../../hooks';

interface ExportToGistProps {
  className?: string;
  classNameLoading?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const MAIN_USER_ID = 1;

export function ExportToGist(data: ExportToGistProps) {
  const { children, className = '', classNameLoading = '', style } = data;

  const { savePhrasesDTOToGist } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const [isLoading, setIsLoading] = useState(false);

  const onExportPhrases = () => {
    setIsLoading(true);

    savePhrasesDTOToGist(MAIN_USER_ID)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result))
      .finally(() => setIsLoading(false));
  };

  return (
    <button
      className={`export-to-gist ${className} ${isLoading && classNameLoading ? classNameLoading : ''}`}
      style={style ?? undefined}
      title="Export phrases to gist"
      type="button"
      onClick={onExportPhrases}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
