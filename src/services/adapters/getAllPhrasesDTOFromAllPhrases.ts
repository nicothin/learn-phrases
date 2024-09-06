import { Phrase, PhraseDTO } from '../../types';
import { getPhraseDTOFromPhrase } from './getPhraseDTOFromPhrase';

export const getAllPhrasesDTOFromAllPhrases = (data: Phrase[]): PhraseDTO[] => {
  const result: PhraseDTO[] = [];
  data.forEach((PhraseDTO) => {
    const thisItemConvertationResult = getPhraseDTOFromPhrase(PhraseDTO);
    if (!thisItemConvertationResult) return;

    result.push(thisItemConvertationResult);
  });
  return result;
};
