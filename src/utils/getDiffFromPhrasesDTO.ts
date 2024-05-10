import { Phrase, PhrasesDTO } from '../types';
import { getKeysWithDifferentValues } from './getKeysWithDifferentValues';
import { getPhraseFromPhraseDTO } from './getPhraseFromPhraseDTO';

type ProcessingError = {
  item: unknown;
  error: string;
};
type DiffEntry = {
  keys: Set<string>;
  firstPhrase: Phrase | null;
  secondPhrase: Phrase | null;
};
type PhrasesDiff = {
  [key: number]: DiffEntry;
};

export type DiffFromPhrases = {
  diffs: PhrasesDiff[];
  processingErrors: ProcessingError[];
};

export const getDiffFromPhrasesDTO = (first: PhrasesDTO, second: PhrasesDTO): DiffFromPhrases => {
  const processingErrors: ProcessingError[] = [];
  const diffs: PhrasesDiff[] = [];

  if (!Array.isArray(first) || !Array.isArray(second) || !first.length || !second.length) {
    return {
      diffs,
      processingErrors,
    };
  }

  const allIDs: Set<number> = new Set();

  const firstMap = new Map();
  first.forEach((item) => {
    const id = item?.[0];
    if (typeof id !== 'number' || isNaN(id)) {
      processingErrors.push({ item, error: 'Incorrect ID.' });
      return;
    }
    firstMap.set(id, item);
    allIDs.add(id);
  });

  const secondMap = new Map();
  second.forEach((item) => {
    const id = item?.[0];
    if (typeof id !== 'number' || isNaN(id)) {
      processingErrors.push({ item, error: 'Incorrect ID.' });
      return;
    }
    secondMap.set(id, item);
    allIDs.add(id);
  });

  allIDs.forEach((id) => {
    if (typeof id !== 'number') {
      processingErrors.push({ item: id, error: 'This is an incorrect ID.' });
      return;
    }

    const phraseDTOFromFirst = firstMap.get(id);
    const phraseFromFirst = getPhraseFromPhraseDTO(phraseDTOFromFirst);
    const phraseDTOFromSecond = secondMap.get(id);
    const phraseFromSecond = getPhraseFromPhraseDTO(phraseDTOFromSecond);

    const keysDiff = getKeysWithDifferentValues(phraseFromFirst, phraseFromSecond);

    if (!keysDiff.size) return;

    diffs.push({
      [id]: {
        keys: keysDiff,
        firstPhrase: phraseFromFirst,
        secondPhrase: phraseFromSecond,
      },
    });
  });

  return {
    diffs,
    processingErrors,
  };
};
