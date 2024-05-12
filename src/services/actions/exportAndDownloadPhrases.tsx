import { NotificationInstance } from 'antd/es/notification/interface';
import { PhrasesDTO } from '../../types';
import { getDate } from '../../utils';
import { getPhrasesDTOFromLocal } from './getPhrasesDTOFromLocal';
import { startDownloadFile } from './startDownloadFile';

export const exportAndDownloadPhrases = async ({
  notificationApi,
}: {
  notificationApi: NotificationInstance;
}) =>
  getPhrasesDTOFromLocal()
    .then((data: PhrasesDTO) => {
      if (!data.length) {
        notificationApi.success({
          message: 'The list of phrases is empty',
          description: 'There is nothing to export.',
        });
        return;
      }
      const text = JSON.stringify(data).replace(/],\[/g, '],\n[');
      const timeStamp = getDate(null, { divider: '-', timeDivider: '_', addTime: true });

      startDownloadFile(`phrases_${timeStamp}.json`, text);

      notificationApi.success({
        message: 'Export completed',
        description: 'Look in the Downloads folder.',
      });
    })
    .catch((error) => {
      console.error(error);
      notificationApi.error({
        message: 'Export failed',
        description: String(error),
      });
    });
