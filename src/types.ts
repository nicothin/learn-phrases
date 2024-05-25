export type KnowledgeLvl = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type PhraseDTO = [number, string, string, string, string, KnowledgeLvl, string, string];
export type PhrasesDTO = PhraseDTO[];

export type Phrase = {
  id: number;
  first: string;
  firstD: string;
  second: string;
  secondD: string;
  knowledgeLvl: KnowledgeLvl;
  createDate: string;
  tags: string;
};
export type Phrases = Phrase[];

export type PhrasesFilterFunction = { func: (phrase: Phrase) => boolean };

export type ButtonPositionType = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export interface FieldData {
  errors?: string[];
}

export interface Tag {
  value: string;
  color?: string;
}
export type Tags = Tag[];
