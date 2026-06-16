import type { Meaning, PartOfSpeech } from '../../types';

export interface ParsedExample {
  text: string;
  translation: string;
}

export interface ParsedMeaning {
  lemma: string;
  translation: string;
  description?: string;
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

const DESC_MARKER = '=';
const DESC_PLACEHOLDER_PREFIX = '\x00DESC_';
const DESC_PLACEHOLDER_SUFFIX = '\x00';

function splitRawBlocks(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}

function extractDescriptionRegions(text: string): { cleanText: string; descriptions: string[] } {
  const lines = text.split('\n');
  const markers: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === DESC_MARKER) {
      markers.push(i);
    }
  }

  const pairCount = Math.floor(markers.length / 2);
  const pairs: [number, number][] = [];
  for (let i = 0; i < pairCount * 2; i += 2) {
    pairs.push([markers[i], markers[i + 1]]);
  }

  if (pairs.length === 0) {
    return { cleanText: text, descriptions: [] };
  }

  const descriptions: string[] = [];
  const resultLines: string[] = [];
  let lastIndex = 0;

  for (const [start, end] of pairs) {
    resultLines.push(...lines.slice(lastIndex, start));

    const descContent = lines.slice(start + 1, end).join('\n');
    descriptions.push(descContent);
    resultLines.push(`${DESC_PLACEHOLDER_PREFIX}${descriptions.length - 1}${DESC_PLACEHOLDER_SUFFIX}`);
    lastIndex = end + 1;
  }

  resultLines.push(...lines.slice(lastIndex));

  return { cleanText: resultLines.join('\n'), descriptions };
}

function restoreRawText(raw: string, descriptions: string[]): string {
  let result = raw;
  for (let i = 0; i < descriptions.length; i++) {
    const placeholder = `${DESC_PLACEHOLDER_PREFIX}${i}${DESC_PLACEHOLDER_SUFFIX}`;
    result = result.replace(
      placeholder,
      `${DESC_MARKER}\n${descriptions[i]}\n${DESC_MARKER}`,
    );
  }
  return result;
}

export function parseImportText(text: string): ImportParseResult {
  const { cleanText, descriptions } = extractDescriptionRegions(text);
  const rawBlocks = splitRawBlocks(cleanText);
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
        rawText: restoreRawText(raw, descriptions),
        error: 'Block must have at least 4 lines: lemma, translation, pos|cefr, and at least 1 example',
      });
      continue;
    }

    const lemma = contentLines[0];
    const translation = contentLines[1];
    const meta = contentLines[2];

    if (!lemma) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: 'Lemma is empty' });
      continue;
    }

    if (!translation) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: 'Translation is empty' });
      continue;
    }

    const separatorIndex = meta.indexOf('|');
    if (separatorIndex === -1) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: `Expected "pos|cefrLevel" format, got "${meta}"` });
      continue;
    }

    const pos = meta.slice(0, separatorIndex) as PartOfSpeech;
    const cefrLevel = meta.slice(separatorIndex + 1);

    if (!POS_VALUES.includes(pos)) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: `Invalid part of speech "${pos}"` });
      continue;
    }

    if (!CEFR_VALUES.has(cefrLevel)) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: `Invalid CEFR level "${cefrLevel}"` });
      continue;
    }

    let description: string | undefined;
    let exampleStartIndex = 3;

    if (contentLines[3].startsWith(DESC_PLACEHOLDER_PREFIX) && contentLines[3].endsWith(DESC_PLACEHOLDER_SUFFIX)) {
      const descIndex = Number(contentLines[3].slice(DESC_PLACEHOLDER_PREFIX.length, -DESC_PLACEHOLDER_SUFFIX.length));
      description = descriptions[descIndex];
      exampleStartIndex = 4;
    }

    const exampleLines = contentLines.slice(exampleStartIndex);
    const examples: ParsedExample[] = [];
    let examplesHaveError = false;

    for (const el of exampleLines) {
      const sepMatch = el.match(/^(.*?)\s*---\s*(.*)$/);

      if (!sepMatch) {
        errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: `Example "${el}" missing separator " --- "` });
        examplesHaveError = true;
        continue;
      }

      const exText = sepMatch[1].trim();
      const exTranslation = sepMatch[2].trim();

      if (!exText) {
        errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: 'Example text is empty' });
        examplesHaveError = true;
        continue;
      }

      if (!exTranslation) {
        errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: 'Example translation is empty' });
        examplesHaveError = true;
        continue;
      }

      examples.push({ text: exText, translation: exTranslation });
    }

    if (examplesHaveError) continue;

    if (examples.length === 0) {
      errors.push({ blockIndex, rawText: restoreRawText(raw, descriptions), error: 'At least 1 example is required' });
      continue;
    }

    meanings.push({
      lemma,
      translation,
      description,
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
  description: incoming.description ?? existing.description,
  pos: incoming.pos,
  cefrLevel: incoming.cefrLevel,
  exampleIds: newExampleIds,
});
