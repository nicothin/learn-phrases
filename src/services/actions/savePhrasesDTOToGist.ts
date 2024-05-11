import { PhrasesDTO } from '../../types';
import { Gist } from '../Gist';

export const savePhrasesDTOToGist = ({
  gist,
  phrasesDTO,
}: {
  gist: Gist;
  phrasesDTO: PhrasesDTO;
}) => gist.setAllPhrases(phrasesDTO);
