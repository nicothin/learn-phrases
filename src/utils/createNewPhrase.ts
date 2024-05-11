import { Phrase } from '../types';
import { convertToKnowledgeLvl } from './convertToKnowledgeLvl';
import { getDate } from './getDate';
import { getStringOrEmpty } from './getStringOrEmpty';

export const createNewPhrase = (data: Partial<Phrase>): Omit<Phrase, 'id'> | null => {
  if (!data || typeof data.first !== 'string' || typeof data.second !== 'string') {
    return null;
  }

  const knowledgeLvl = convertToKnowledgeLvl(data?.knowledgeLvl);

  const newPhrase = {
    first: data.first,
    firstD: getStringOrEmpty(data?.firstD),
    second: data.second,
    secondD: getStringOrEmpty(data?.secondD),
    knowledgeLvl,
    createDate: getDate(data?.createDate),
    tags: getStringOrEmpty(data.tags),
  };

  return newPhrase;
};
