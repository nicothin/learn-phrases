import { useState } from 'react';
import { FloatButton } from 'antd';
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { NotificationInstance } from 'antd/es/notification/interface';

import { ButtonPositionType, PhrasesDTO } from '../../types';
import { Gist } from '../../services/Gist';
import { getPhrasesDTOFromLocal, savePhrasesDTOToGist } from '../../services/actions';

type ExportToGistFloatButtonProps = {
  readonly buttonPosition: ButtonPositionType;
  readonly gist: Gist;
  readonly notificationApi: NotificationInstance;
};

export default function ExportToGistFloatButton({
  buttonPosition,
  gist,
  notificationApi,
}: ExportToGistFloatButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onClickExportToGist = async () => {
    setIsUploading(true);

    getPhrasesDTOFromLocal()
      .then((phrasesDTO: PhrasesDTO) => {
        savePhrasesDTOToGist({ gist, phrasesDTO })
          .then((res) => {
            console.log('res', res);
            notificationApi.success({
              message: 'Export to gist completed',
              description: (
                <div>
                  The export to <a href={res.data.html_url}>this gist</a> has been successfully
                  completed.
                </div>
              ),
            });
          })
          .catch((error: Error) => {
            console.error(error);
            notificationApi?.error({
              message: 'Export failed',
              description: error.message,
            });
          })
          .finally(() => {
            setIsUploading(false);
          });
      })
      .catch((error) => {
        console.error(error);
        notificationApi.error({
          message: 'Export failed',
          description: String(error),
        });
        setIsUploading(false);
      });
  };

  return (
    <FloatButton
      shape="circle"
      style={buttonPosition}
      icon={isUploading ? <LoadingOutlined /> : <CloudUploadOutlined />}
      onClick={onClickExportToGist}
    />
  );
}
