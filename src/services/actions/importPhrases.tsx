import { NotificationInstance } from 'antd/es/notification/interface';
import { PhrasesDTO } from '../../types';
import { HookAPI } from 'antd/es/modal/useModal';
import { getAllPhrasesFromAllPhrasesDTO } from '../../utils';
import { DexieIndexedDB } from '../DexieIndexedDB';
import { DEXIE_TABLE_NAME } from '../../constants';

export const importPhrases = ({
  newPhrasesDTO,
  notificationApi,
  modalApi,
}: {
  newPhrasesDTO: PhrasesDTO;
  notificationApi: NotificationInstance;
  modalApi: HookAPI;
}) => {
  const onModalOk = (newPhrasesDTO: PhrasesDTO) => {
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

  modalApi.confirm({
    title: 'Are you sure?',
    content: (
      <>
        <p>
          If the ID of the imported phrases matches the local IDs, the local data will be replaced.{' '}
        </p>
        <p>This action cannot be reversed. Make a backup.</p>
      </>
    ),
    okText: 'Yes, replace the local data',
    cancelText: 'Cancel',
    onOk: () => onModalOk(newPhrasesDTO),
  });
};
