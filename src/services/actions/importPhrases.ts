import { NotificationInstance } from 'antd/es/notification/interface';
import { PhrasesDTO } from '../../types';
import { DexieIndexedDB } from '../DexieIndexedDB';
import { DEXIE_TABLE_NAME } from '../../constants';
import { getAllPhrasesFromAllPhrasesDTO } from '../adapters';

export const importPhrases = ({
  newPhrasesDTO,
  notificationApi,
}: {
  newPhrasesDTO: PhrasesDTO;
  notificationApi: NotificationInstance;
}) => {
  const phrases = getAllPhrasesFromAllPhrasesDTO(newPhrasesDTO);

  DexieIndexedDB[DEXIE_TABLE_NAME].bulkPut(phrases)
    .then(() => {
      notificationApi.success({
        message: 'Import completed',
      });
    })
    .catch((error: Error) => {
      console.error(error);
      notificationApi.error({
        message: 'Import failed',
        description: String(error),
      });
    });
};
