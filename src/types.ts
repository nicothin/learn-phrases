export interface ExamplePhrase {
  id: string;
  text: string;
  textDescription?: string;
  translation: string;
  translationDescription?: string;
  lastShownTimestamp?: number;
}

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';

export interface Meaning {
  id: string;
  lemma: string;
  translation: string;
  description?: string;
  pos: PartOfSpeech;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  exampleIds: string[];
  knowledgeLvl: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  showAfterTimestamp?: number;
  lastShowTimestamp?: number;
}

export interface UserSettings {
  githubToken: string;
  gistId: string;
  preferredTheme: 'light' | 'dark' | 'system';
}

export interface LearningItem {
  meaning: Meaning;
  phrase: ExamplePhrase;
}

export interface ExportData {
  meta: {
    version: string;
  };
  meanings: Meaning[];
  phrases: ExamplePhrase[];
}

export interface Log {
  type: 'ERROR';
  message: string;
  details?: string;
}
