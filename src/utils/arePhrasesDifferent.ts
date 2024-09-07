import { Phrase } from '../types';
import { arrayOfStringAreEqual } from './arrayOfStringAreEqual';

export const arePhrasesDifferent = (phrase1: Partial<Phrase>, phrase2: Partial<Phrase>): (keyof Phrase)[] => {
  const result: (keyof Phrase)[] = [];

  const validatedFields: (keyof Phrase)[] = [
    // 'id',
    'first',
    'firstD',
    'second',
    'secondD',
    'knowledgeLvl',
    // 'createDate',
  ];

  validatedFields.forEach((field) => {
    if (phrase1[field] !== phrase2[field]) {
      result.push(field);
    }
  });

  if (!arrayOfStringAreEqual(phrase1.tags ?? [], phrase2.tags ?? [])) {
    result.push('tags');
  }

  return result;
};
