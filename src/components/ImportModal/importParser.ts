import type { Meaning, PartOfSpeech } from '../../types';

export interface ParsedExample {
  text: string;
  translation: string;
}

export interface ParsedMeaning {
  lemma: string;
  translation: string;
  pos: PartOfSpeech;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  examples: ParsedExample[];
}

export interface BlockError {
  blockIndex: number;
  rawText: string;
  error: string;
}

export interface ImportParseResult {
  meanings: ParsedMeaning[];
  errors: BlockError[];
}

export interface ImportConflict {
  existing: Meaning;
  incoming: ParsedMeaning;
}

const POS_VALUES: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb',
  'pronoun', 'preposition', 'conjunction', 'interjection',
];

const CEFR_VALUES: ReadonlySet<string> = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

function splitRawBlocks(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}

export function parseImportText(text: string): ImportParseResult {
  const rawBlocks = splitRawBlocks(text);
  const meanings: ParsedMeaning[] = [];
  const errors: BlockError[] = [];

  for (const [blockIndex, raw] of rawBlocks.entries()) {
    const contentLines = raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (contentLines.length === 0) continue;

    if (contentLines.length < 4) {
      errors.push({
        blockIndex,
        rawText: raw,
        error: 'Block must have at least 4 lines: lemma, translation, pos|cefr, and at least 1 example',
      });
      continue;
    }

    const lemma = contentLines[0];
    const translation = contentLines[1];
    const meta = contentLines[2];
    const exampleLines = contentLines.slice(3);

    if (!lemma) {
      errors.push({ blockIndex, rawText: raw, error: 'Lemma is empty' });
      continue;
    }

    if (!translation) {
      errors.push({ blockIndex, rawText: raw, error: 'Translation is empty' });
      continue;
    }

    const separatorIndex = meta.indexOf('|');
    if (separatorIndex === -1) {
      errors.push({ blockIndex, rawText: raw, error: `Expected "pos|cefrLevel" format, got "${meta}"` });
      continue;
    }

    const pos = meta.slice(0, separatorIndex) as PartOfSpeech;
    const cefrLevel = meta.slice(separatorIndex + 1);

    if (!POS_VALUES.includes(pos)) {
      errors.push({ blockIndex, rawText: raw, error: `Invalid part of speech "${pos}"` });
      continue;
    }

    if (!CEFR_VALUES.has(cefrLevel)) {
      errors.push({ blockIndex, rawText: raw, error: `Invalid CEFR level "${cefrLevel}"` });
      continue;
    }

    const examples: ParsedExample[] = [];
    let examplesHaveError = false;

    for (const el of exampleLines) {
      const sepMatch = el.match(/^(.*?)\s*---\s*(.*)$/);

      if (!sepMatch) {
        errors.push({ blockIndex, rawText: raw, error: `Example "${el}" missing separator " --- "` });
        examplesHaveError = true;
        continue;
      }

      const exText = sepMatch[1].trim();
      const exTranslation = sepMatch[2].trim();

      if (!exText) {
        errors.push({ blockIndex, rawText: raw, error: 'Example text is empty' });
        examplesHaveError = true;
        continue;
      }

      if (!exTranslation) {
        errors.push({ blockIndex, rawText: raw, error: 'Example translation is empty' });
        examplesHaveError = true;
        continue;
      }

      examples.push({ text: exText, translation: exTranslation });
    }

    if (examplesHaveError) continue;

    if (examples.length === 0) {
      errors.push({ blockIndex, rawText: raw, error: 'At least 1 example is required' });
      continue;
    }

    meanings.push({
      lemma,
      translation,
      pos,
      cefrLevel: cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
      examples,
    });
  }

  return { meanings, errors };
}

export const findExistingMeaning = ({
  meanings,
  lemma,
  pos,
}: {
  meanings: Record<string, Meaning>;
  lemma: string;
  pos: PartOfSpeech;
}): Meaning | undefined => (
  Object.values(meanings).find((m) => m.lemma === lemma && m.pos === pos)
);

export const mergeMeaning = ({
  existing,
  incoming,
  newExampleIds,
}: {
  existing: Meaning;
  incoming: ParsedMeaning;
  newExampleIds: string[];
}): Meaning => ({
  ...existing,
  lemma: incoming.lemma,
  translation: incoming.translation,
  pos: incoming.pos,
  cefrLevel: incoming.cefrLevel,
  exampleIds: newExampleIds,
});
