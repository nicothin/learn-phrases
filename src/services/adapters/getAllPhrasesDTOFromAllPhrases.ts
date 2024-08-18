import { PhrasesDTO, Phrases } from '../../types';
import { getPhraseDTOFromPhrase } from './getPhraseDTOFromPhrase';

export const getAllPhrasesDTOFromAllPhrases = (data: Phrases): PhrasesDTO => {
  const result: PhrasesDTO = [];
  data.forEach((PhraseDTO) => {
    const thisItemConvertationResult = getPhraseDTOFromPhrase(PhraseDTO);
    if (!thisItemConvertationResult) return;

    result.push(thisItemConvertationResult);
  });
  return result;
};
