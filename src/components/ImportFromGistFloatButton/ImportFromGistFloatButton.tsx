import { useState } from 'react';
import { FloatButton } from 'antd';
import { CloudDownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { NotificationInstance } from 'antd/es/notification/interface';
import { HookAPI } from 'antd/es/modal/useModal';

import { ButtonPositionType } from '../../types';
import { Gist } from '../../services/Gist';
import { getPhrasesDTOGromGist, importPhrases } from '../../services/actions';

type ImportFromGistFloatButtonProps = {
  readonly buttonPosition: ButtonPositionType;
  readonly gist: Gist;
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

  const onClickImportFromGist = async () => {
    setIsDownloading(true);

    getPhrasesDTOGromGist({ gist })
      .then((phrasesDTO) => {
        importPhrases({ newPhrasesDTO: phrasesDTO, notificationApi, modalApi });
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

  return (
    <FloatButton
      shape="circle"
      style={buttonPosition}
      icon={isDownloading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
      onClick={onClickImportFromGist}
    />
  );
}
