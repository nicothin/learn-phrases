import { Gist } from '../Gist';

export const getPhrasesDTOGromGist = ({ gist }: { gist: Gist }) => gist.getAllPhrases();
