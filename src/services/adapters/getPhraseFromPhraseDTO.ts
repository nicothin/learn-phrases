import { Phrase } from '../../types';
import { convertToKnowledgeLvl } from '../../utils/convertToKnowledgeLvl';
import { getValidatedPhrase } from '../../utils/getValidatedPhrase';

export const getPhraseFromPhraseDTO = (data: unknown): Partial<Phrase> | null => {
  if (
    !Array.isArray(data) ||
    data.length < 4 ||
    typeof data[0] !== 'number' ||
    typeof data[1] !== 'string' || !data[1] ||
    typeof data[2] !== 'string' ||
    typeof data[3] !== 'string' || !data[3]
  ) {
    console.error('Invalid phrase data:', data);
    return null;
  }

  const knowledgeLvl = convertToKnowledgeLvl(data?.[5]);

  const date = Date.now();
  let createDate = new Date(date).toISOString();
  try {
    createDate = new Date(data[6]).toISOString();
  } catch (error) {
    console.error(error, data);
  }

  const newPhrase: Phrase = {
    id: data[0],
    first: data[1],
    firstD: data[2],
    second: data[3],
    secondD: data?.[4] ?? '',
    knowledgeLvl,
    createDate,
    tags: data?.[7],
  };

  return getValidatedPhrase(newPhrase, true);
};
