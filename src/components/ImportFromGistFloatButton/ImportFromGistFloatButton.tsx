import { useState } from 'react';
import { Alert, FloatButton } from 'antd';
import { CloudDownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { NotificationInstance } from 'antd/es/notification/interface';
import { HookAPI } from 'antd/es/modal/useModal';

import { ButtonPositionType } from '../../types';
import { Gist } from '../../services/Gist';
import {
  exportAndDownloadPhrases,
  getPhrasesDTOGromGist,
  importPhrases,
} from '../../services/actions';

type ImportFromGistFloatButtonProps = {
  readonly buttonPosition: ButtonPositionType;
  readonly gist: Gist | null;
  readonly notificationApi: NotificationInstance;
  readonly modalApi: HookAPI;
};

export default function ImportFromGistFloatButton({
  buttonPosition,
  gist,
  notificationApi,
  modalApi,
}: ImportFromGistFloatButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const onModalOk = async () => {
    setIsDownloading(true);

    await exportAndDownloadPhrases({ notificationApi });

    getPhrasesDTOGromGist({ gist })
      .then((phrasesDTO) => {
        importPhrases({ newPhrasesDTO: phrasesDTO, notificationApi });
      })
      .catch((error: Error) => {
        console.error(error);
        notificationApi?.error({
          message: 'Phrases downloading error',
          description: error.message,
        });
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  const onClickImportFromGist = () => {
    modalApi.confirm({
      title: 'Replace local data?',
      icon: null,
      content: (
        <>
          <p style={{ marginTop: 0 }}>
            If the ID of the imported phrases matches the local IDs, the local data will be
            replaced.
          </p>
          <Alert
            message="Before importing from gist, local phrases will be exported to a file and downloaded."
            type="info"
            style={{ marginBottom: 16 }}
          />
        </>
      ),
      okText: 'Yes, replace local data',
      cancelText: 'Cancel',
      onOk: () => onModalOk(),
    });
  };

  return (
    <FloatButton
      shape="circle"
      style={buttonPosition}
      icon={isDownloading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
      onClick={onClickImportFromGist}
    />
  );
}
