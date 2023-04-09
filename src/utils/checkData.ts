import { Phrase } from '../types';
import { checkString } from './checkString';

export const checkData = (dataArray: Phrase[]): Phrase[] => {
  if (!dataArray?.length) return [];

  return dataArray
    .filter((item) => (
      typeof item.id === 'string' && checkString(item.id) &&
      checkString(item.languages.first.content.trim()) &&
      checkString(item.languages.second.content.trim())
    ))
    .map((item) => ({
      id: item.id,
      languages: {
        first: { content: item.languages.first.content.trim(), descr: item.languages.first?.descr?.trim() || '' },
        second: { content: item.languages.second.content.trim(), descr: item.languages.second?.descr?.trim() || '' },
      },
      myKnowledgeLvl: item?.myKnowledgeLvl || 5,
    })) || [];
};
