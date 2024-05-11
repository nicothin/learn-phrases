import { PhrasesDTO, Phrases } from '../types';
import { getPhraseFromPhraseDTO } from './getPhraseFromPhraseDTO';

export const getAllPhrasesFromAllPhrasesDTO = (data: PhrasesDTO): Phrases => {
  const result: Phrases = [];
  data.forEach((phraseDTO) => {
    const thisItemConvertationResult = getPhraseFromPhraseDTO(phraseDTO);
    if (!thisItemConvertationResult) return;

    result.push(thisItemConvertationResult);
  });
  return result;
};
