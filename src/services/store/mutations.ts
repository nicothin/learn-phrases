import { saveMeaning as dbSaveMeaning, deleteMeaning as dbDeleteMeaning } from '../db/meaningRepo';
import { savePhrase as dbSavePhrase, deletePhrase as dbDeletePhrase } from '../db/phraseRepo';
import { useStore } from './index';
import { useSessionStore } from './sessionStore';
import type { Meaning, ExamplePhrase } from '../../types';

export const saveMeaning = async (meaning: Meaning) => {
  await dbSaveMeaning(meaning);
  useStore.setState((s) => ({
    meanings: { ...s.meanings, [meaning.id]: meaning },
  }));
  useSessionStore.getState().updateMeaningInSession(meaning);
};

export const deleteMeaning = async (id: string) => {
  await dbDeleteMeaning(id);
  useStore.setState((s) => {
    const { [id]: _id, ...rest } = s.meanings;
    void _id;

    return { meanings: rest };
  });
  useSessionStore.getState().removeByMeaningId(id);
};

export const savePhrase = async (phrase: ExamplePhrase) => {
  await dbSavePhrase(phrase);
  useStore.setState((s) => ({
    phrases: { ...s.phrases, [phrase.id]: phrase },
  }));
  useSessionStore.getState().updatePhraseInSession(phrase);
};

export const deletePhrase = async (id: string) => {
  await dbDeletePhrase(id);
  useStore.setState((s) => {
    const { [id]: _id, ...rest } = s.phrases;
    void _id;

    return { phrases: rest };
  });
  useSessionStore.getState().removeByPhraseId(id);
};
