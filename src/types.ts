export type Mode = 'edit' | 'learn';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type Phrase = {
  id: string;

  first: string;
  firstD?: string;

  second: string;
  secondD?: string;

  myKnowledgeLvl: number;
};
