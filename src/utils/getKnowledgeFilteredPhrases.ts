import { Phrase } from '../types';

export const getKnowledgeFilteredPhrases = (phrases: Phrase[]): Phrase[] =>
  phrases.filter((phrase) => phrase.myKnowledgeLvl < 9);
