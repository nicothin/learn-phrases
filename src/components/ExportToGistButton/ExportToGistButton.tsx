import { ReactNode } from 'react';

import { useMainContext, useNotificationContext } from '../../hooks';

interface ExportToGistButtonProps {
  className?: string;
  classNameLoading?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const MAIN_USER_ID = 1;

export function ExportToGistButton(data: ExportToGistButtonProps) {
  const { children, className = '', classNameLoading = '', style } = data;

  const { exportPhrasesDTOToGist, isDataExchangeWithGist, isExportingDataToGist } = useMainContext();
  const { addNotification } = useNotificationContext();

  const onExportPhrases = () => {
    exportPhrasesDTOToGist(MAIN_USER_ID)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  return (
    <button
      className={`export-to-gist ${className} ${isExportingDataToGist && classNameLoading ? classNameLoading : ''}`}
      style={style ?? undefined}
      title="Export phrases to gist"
      type="button"
      onClick={onExportPhrases}
      disabled={isDataExchangeWithGist}
    >
      {children}
    </button>
  );
}
