import { nanoid } from 'nanoid';
import { CreatePhraseType, Phrase } from '../types';

export const createItem = ({ id, first, second, firstD, secondD, myKnowledgeLvl = 1 }: CreatePhraseType): Phrase => {
  if (!id) id = nanoid(6);
  first = first?.trim();
  second = second?.trim();
  firstD = firstD?.trim() || '';
  secondD = secondD?.trim() || '';

  if (!first && !second) {
    throw new Error('Both phrases must be specified.');
  }

  return ({
    id,
    languages: {
      first: { content: first, descr: firstD },
      second: { content: second, descr: secondD },
    },
    myKnowledgeLvl,
  })
};
