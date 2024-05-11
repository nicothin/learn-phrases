import { DEXIE_TABLE_NAME } from '../../constants';
import { DexieIndexedDB } from '../DexieIndexedDB';

export const deletePhraseLocally = async (id: number): Promise<void> => {
  if (typeof id !== 'number' || isNaN(id)) {
    throw Error(`Phrase not deleted: ${id} is not a ID`);
  }

  return DexieIndexedDB[DEXIE_TABLE_NAME].delete(id);
};
