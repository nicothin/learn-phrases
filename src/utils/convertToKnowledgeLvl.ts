import { KnowledgeLvl } from '../types';

export const convertToKnowledgeLvl = (value: unknown): KnowledgeLvl => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return 0;
  }

  let num = 0;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    const parsedNum = parseInt(value, 10);
    if (!isNaN(parsedNum)) {
      num = parsedNum;
    }
  }

  return Math.max(0, Math.min(9, num)) as KnowledgeLvl;
};
