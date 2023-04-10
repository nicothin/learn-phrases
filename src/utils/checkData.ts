import { Phrase } from '../types';
import { checkString } from './checkString';

export const checkData = (dataArray: Phrase[]): Phrase[] => {
  if (!dataArray?.length) return [];

  return dataArray
    .filter(
      (item) =>
        typeof item.id === 'string' &&
        checkString(item.id) &&
        checkString(item.first.trim()) &&
        checkString(item.second.trim()),
    )
    .map((item) => ({
      id: item.id,
      first: item.first.trim(),
      firstD: item.firstD?.trim() || '',
      second: item.second.trim(),
      secondD: item.secondD?.trim() || '',
      myKnowledgeLvl: item?.myKnowledgeLvl || 1,
    }));
};
