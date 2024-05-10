import { DEXIE_TABLE_NAME } from '../../constants';
import { DexieIndexedDB } from '../DexieIndexedDB';

export const deleteAllPhrasesLocally = async (): Promise<void> =>
  DexieIndexedDB[DEXIE_TABLE_NAME].clear();
