import { DEXIE_TABLE_NAME } from '../../constants';
import { PhrasesDTO } from '../../types';
import { getAllPhrasesDTOFromAllPhrases } from '../adapters';
import { DexieIndexedDB } from '../DexieIndexedDB';

export const getPhrasesDTOFromLocal = async (): Promise<PhrasesDTO> =>
  DexieIndexedDB[DEXIE_TABLE_NAME].toArray((allPhrases) =>
    getAllPhrasesDTOFromAllPhrases(allPhrases),
  );
