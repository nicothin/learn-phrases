import { Phrase } from '../types';
import { getDate } from './getDate';
import { convertToKnowledgeLvl } from './convertToKnowledgeLvl';

export const getPhraseFromPhraseDTO = (data: unknown): Phrase | null => {
  if (
    !Array.isArray(data) ||
    data.length < 4 ||
    typeof data[0] !== 'number' ||
    typeof data[1] !== 'string' ||
    typeof data[2] !== 'string' ||
    typeof data[3] !== 'string'
  ) {
    return null;
  }

  const knowledgeLvl = convertToKnowledgeLvl(data[5]);

  const getPseudoArray = (data: unknown) =>
    typeof data === 'string'
      ? [
          ...new Set(
            data
              .split(',')
              .filter((item) => typeof item === 'string')
              .map((item) => item.trim()),
          ),
        ].join(',')
      : '';

  const newPhrase: Phrase = {
    id: data[0],
    first: data[1],
    firstD: data[2],
    second: data[3],
    secondD: data[4] ?? '',
    knowledgeLvl,
    createDate: getDate(data[6]),
    tags: getPseudoArray(data[7]),
  };

  return newPhrase;
};
