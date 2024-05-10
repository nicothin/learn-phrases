import { DEXIE_TABLE_NAME } from '../../constants';
import { Phrase } from '../../types';
import { DexieIndexedDB } from '../DexieIndexedDB';
import { createNewPhrase, hasNotEmptyStringProperty } from '../../utils';

export const savePhraseLocally = async (data: Partial<Phrase>): Promise<number> => {
  const isEnoughDataToSave =
    hasNotEmptyStringProperty(data, 'first') && hasNotEmptyStringProperty(data, 'second');

  if (!isEnoughDataToSave) {
    throw Error('Fields "first" and "second" are needed to save the phrase');
  }

  const isNewPhrase = typeof data === 'object' && data !== null && !('id' in data);

  if (isNewPhrase) {
    const newPhrase = createNewPhrase(data);

    if (!newPhrase) {
      throw Error('Unable to generate new phrase data');
    }

    return DexieIndexedDB[DEXIE_TABLE_NAME].add(newPhrase as Phrase);
  }

  // TODO: add guards
  const phrase = { ...data };

  return DexieIndexedDB[DEXIE_TABLE_NAME].update(phrase.id, phrase);
};
