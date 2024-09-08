import { useMainContext, useNotificationContext } from '../../hooks';

interface ExportToFileButtonProps {
  className?: string;
  children?: string;
}

export const ExportToFileButton = (data: ExportToFileButtonProps) => {
  const { className, children } = data;
  const { exportPhrasesDTOToFile } = useMainContext();
  const { addNotification } = useNotificationContext();

  const exportToFile = () => {
    exportPhrasesDTOToFile()
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  return (
    <button className={`export-to-file-button ${className ?? ''}`} onClick={exportToFile}>
      <span className="export-to-file-button__text">{children ?? 'Export phrases to file'}</span>
    </button>
  );
};
