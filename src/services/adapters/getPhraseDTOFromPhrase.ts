import { Phrase, PhraseDTO } from '../../types';

// TODO[@nicothin]: USE getValidatedPhrase

export const getPhraseDTOFromPhrase = (data: Phrase): PhraseDTO | null => {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof data.id !== 'number' ||
    !data.first ||
    typeof data.first !== 'string' ||
    !data.second ||
    typeof data.second !== 'string'
  ) {
    return null;
  }

  const newPhraseDTO: PhraseDTO = [
    data.id,
    data.first,
    data.firstD ?? '',
    data.second,
    data.secondD ?? '',
    data.knowledgeLvl ?? 0,
    data.createDate,
    data.tags.join(',') ?? '',
  ];

  return newPhraseDTO;
};
