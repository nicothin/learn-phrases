import { PhrasesDTO } from '../../types';
import { Gist, OctokitResponse } from '../Gist';

export const savePhrasesDTOToGist = ({
  gist,
  phrasesDTO,
}: {
  gist: Gist | null;
  phrasesDTO: PhrasesDTO;
}): Promise<OctokitResponse> => {
  if (!gist) {
    return Promise.reject(new Error('Gist instance is null'));
  }

  return gist.setAllPhrases(phrasesDTO);
};
