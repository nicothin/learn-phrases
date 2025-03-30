import { ReactNode } from 'react';

import { STATUS } from './enums';

export interface IDBObjectFieldsParameters {
  type?: string;
  multiEntry?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
}
export interface IDBObjectFields {
  [key: string]: IDBObjectFieldsParameters;
}
export interface IDBTable {
  name: string;
  keyPath: string;
}

export type KnowledgeLvl = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type PhraseDTO = [
  Phrase['id'],
  Phrase['first'],
  Phrase['firstD'],
  Phrase['second'],
  Phrase['secondD'],
  KnowledgeLvl,
  Phrase['createDate'],
  string, // Phrase['tags'],
];
export interface Phrase {
  id: number;
  first: string;
  firstD: string;
  second: string;
  secondD: string;
  knowledgeLvl: KnowledgeLvl;
  createDate: string;
  tags: string[];
}
export interface Replacement {
  search: RegExp;
  replace: string;
}

export interface Notification {
  text: string;
  id?: number;
  description?: string | ReactNode;
  consoleDescription?: unknown;
  type?: STATUS;
  duration?: number;
  timeoutId?: NodeJS.Timeout;
}

export interface UserSettings {
  userId: number;
  token: string;
  gistId: string;
  syncOn100percent: boolean;
  checkGistWhenSwitchingToLearn: boolean;
  // tags: string;
  speechSynthesisVoiceForSecondPhrase: string;
}

export interface Conflict {
  incomingPhrase: Partial<Phrase>;
  existingPhrase: Phrase | undefined;
  differentFields: (keyof Phrase)[];
  isIncomingSelected: boolean;
}

export interface ImportPhrasesDTOFromGist {
  notification: Notification;
  payload: PhraseDTO[];
}

export interface SelectOption {
  value: string;
  label: string | ReactNode;
}
