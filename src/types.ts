interface PhraseData {
  content: string,
  descr: string,
}

export interface Phrase {
  id: string,
  languages: {
    first: PhraseData,
    second: PhraseData,
  },
  myKnowledgeLvl: number,
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type CreatePhraseType = {
  id?: string;
  first: string;
  second: string;
  firstD?: string;
  secondD?: string;
  myKnowledgeLvl?: number;
}
