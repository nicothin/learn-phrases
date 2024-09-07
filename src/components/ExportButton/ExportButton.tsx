import { useActionsContext, useNotificationContext } from '../../hooks';

interface ExportButtonProps {
  className?: string;
  children?: string;
}

export const ExportButton = (data: ExportButtonProps) => {
  const { className, children } = data;
  const { exportPhrasesDTOToFile } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const exportToFile = () => {
    exportPhrasesDTOToFile()
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  return (
    <button className={`export-button ${className ?? ''}`} onClick={exportToFile}>
      <span className="export-button__text">{children ?? 'Export phrases to file'}</span>
    </button>
  );
};
