import { nanoid } from 'nanoid';

export const createItem = ({ id, first, second, firstDescr, secondDescr, level = 'a0', myKnowledgeLvl = 5 }) => {
  if (!id) id = nanoid(6);
  first = first?.trim();
  second = second?.trim();
  firstDescr = firstDescr?.trim() || '';
  secondDescr = secondDescr?.trim() || '';

  if (!first && !second) {
    throw new Error('Both phrases must be specified.');
  }

  return ({
    id,
    languages: {
      first: { content: first, descr: firstDescr },
      second: { content: second, descr: secondDescr },
    },
    level,
    myKnowledgeLvl,
  })
};
