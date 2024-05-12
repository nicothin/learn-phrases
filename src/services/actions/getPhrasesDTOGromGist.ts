import { PhrasesDTO } from '../../types';
import { Gist } from '../Gist';

export const getPhrasesDTOGromGist = ({ gist }: { gist: Gist | null }): Promise<PhrasesDTO> => {
  if (!gist) {
    return Promise.reject(new Error('Gist instance is null'));
  }

  return gist.getAllPhrases();
};
