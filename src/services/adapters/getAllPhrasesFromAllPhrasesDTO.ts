import { STATUS } from '../../enums';
import { PhraseDTO, Phrase, Notification } from '../../types';
import { getPhraseFromPhraseDTO } from './getPhraseFromPhraseDTO';

interface GetAllPhrasesFromAllPhrasesDTOResult {
  phrases: Partial<Phrase>[];
  notification: Notification;
}

export const getAllPhrasesFromAllPhrasesDTO = (data: PhraseDTO[]): GetAllPhrasesFromAllPhrasesDTOResult => {
  const phrases: Partial<Phrase>[] = [];
  const errors: unknown[] = [];

  data.forEach((phraseDTO) => {
    const thisItemConvertationResult = getPhraseFromPhraseDTO(phraseDTO);
    if (!thisItemConvertationResult) {
      errors.push(['Error converting phrase from DTO:', phraseDTO]);
      return;
    }

    phrases.push(thisItemConvertationResult);
  });

  return {
    phrases,
    notification: errors.length
      ? {
          text: 'Some errors occurred during conversion phrasesDTO to phrases.',
          description: 'See the console logs for more information.',
          consoleDescription: errors,
          type: STATUS.ERROR,
        }
      : {
          text: 'Completely successful conversion of phrases from DTO',
          type: STATUS.SUCCESS,
          duration: 3000,
        },
  };
};
