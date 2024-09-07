import { Phrase } from '../types';
import { convertToKnowledgeLvl } from './convertToKnowledgeLvl';

export const getValidatedPhrase = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phrase: any,
  idIsRequired: boolean = false,
): Partial<Phrase> | null => {
  if (
    typeof phrase !== 'object' ||
    phrase === null ||
    typeof phrase.first !== 'string' ||
    typeof phrase.second !== 'string' ||
    (idIsRequired && (typeof phrase.id !== 'number' || Number.isNaN(phrase.id)))
  ) {
    return null;
  }

  let createDate = new Date().toISOString().slice(0, -1);
  try {
    const date = new Date(phrase.createDate);
    createDate = date.toISOString().slice(0, -1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // console.log(_, phrase);
  }

  const tags = Array.isArray(phrase.tags) ? phrase.tags : [];

  const result: Partial<Phrase> = {
    first: phrase.first.trim(),
    firstD: String(phrase.firstD).trim() ?? '',
    second: phrase.second.trim(),
    secondD: String(phrase.secondD).trim() ?? '',
    knowledgeLvl: convertToKnowledgeLvl(phrase.knowledgeLvl),
    createDate,
    tags,
  };

  if (idIsRequired) {
    result.id = phrase.id;
  }

  return result;
};
