import { describe, test, expect } from 'vitest';
import { parseImportText } from '../importParser';

describe('parseImportText', () => {
  test('parses a single valid block', () => {
    const input = `run\nбегать\nverb|A1\nI run every day --- Я бегаю каждый день`;

    const result = parseImportText(input);

    expect(result.errors).toHaveLength(0);
    expect(result.meanings).toHaveLength(1);
    expect(result.meanings[0]).toEqual({
      lemma: 'run',
      translation: 'бегать',
      pos: 'verb',
      cefrLevel: 'A1',
      examples: [{ text: 'I run every day', translation: 'Я бегаю каждый день' }],
    });
  });

  test('parses multiple blocks separated by blank line', () => {
    const input = `run\nбегать\nverb|A1\nI run --- Я бегу\n\nbig\nбольшой\nadjective|A2\nA big house --- Большой дом\nBig car --- Большая машина`;

    const result = parseImportText(input);

    expect(result.errors).toHaveLength(0);
    expect(result.meanings).toHaveLength(2);
    expect(result.meanings[0].lemma).toBe('run');
    expect(result.meanings[1].lemma).toBe('big');
    expect(result.meanings[1].examples).toHaveLength(2);
  });

  test('ignores comment lines starting with #', () => {
    const input = `# this is a comment\nrun\nбегать\nverb|A1\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.errors).toHaveLength(0);
    expect(result.meanings).toHaveLength(1);
  });

  test('ignores empty lines and whitespace-only lines', () => {
    const input = `\n  \nrun\nбегать\nverb|A1\nI run --- Я бегу\n\n  \nbig\nбольшой\nadjective|A2\nBig --- Большой`;

    const result = parseImportText(input);

    expect(result.errors).toHaveLength(0);
    expect(result.meanings).toHaveLength(2);
  });

  test('returns error when block has fewer than 4 lines', () => {
    const input = `run\nбегать\nverb|A1`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('at least 4 lines');
  });

  test('returns error when lemma is empty', () => {
    const input = `\nбегать\nverb|A1\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('at least 4 lines');
  });

  test('blank line separator creates separate short blocks', () => {
    const input = `run\n \nverb|A1\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0].error).toContain('at least 4 lines');
    expect(result.errors[1].error).toContain('at least 4 lines');
  });

  test('returns error when meta line has wrong format', () => {
    const input = `run\nбегать\nverb\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('Expected "pos|cefrLevel" format');
  });

  test('returns error when POS is invalid', () => {
    const input = `run\nбегать\nverbz|A1\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe('Invalid part of speech "verbz"');
  });

  test('returns error when CEFR level is invalid', () => {
    const input = `run\nбегать\nverb|A5\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe('Invalid CEFR level "A5"');
  });

  test('returns error when example has no separator', () => {
    const input = `run\nбегать\nverb|A1\nI run every day`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('missing separator');
  });

  test('returns error when example text is empty', () => {
    const input = `run\nбегать\nverb|A1\n --- Я бегу`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe('Example text is empty');
  });

  test('returns error when example translation is empty', () => {
    const input = `run\nбегать\nverb|A1\nI run ---`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe('Example translation is empty');
  });

  test('returns error when no examples provided', () => {
    const input = `run\nбегать\nverb|A1`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe('Block must have at least 4 lines: lemma, translation, pos|cefr, and at least 1 example');
  });

  test('mixed valid and invalid blocks', () => {
    const input = `run\nбегать\nverb|A1\nI run --- Я бегу\n\nbad\ntranslation\nwrong|format\nno examples here`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(1);
    expect(result.meanings[0].lemma).toBe('run');
    expect(result.errors).toHaveLength(1);
  });

  test('preserves raw text in error for re-edit', () => {
    const input = `run\nбегать\nverbz|A1\nI run --- Я бегу`;

    const result = parseImportText(input);

    expect(result.errors[0].rawText).toBe(input);
  });

  test('trims whitespace from all fields', () => {
    const input = `  run  \n  бегать  \n  verb|A1  \n  I run --- Я бегу  `;

    const result = parseImportText(input);

    expect(result.meanings[0].lemma).toBe('run');
    expect(result.meanings[0].translation).toBe('бегать');
    expect(result.meanings[0].pos).toBe('verb');
    expect(result.meanings[0].examples[0].text).toBe('I run');
    expect(result.meanings[0].examples[0].translation).toBe('Я бегу');
  });

  test('returns empty result for empty input', () => {
    const result = parseImportText('');

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  test('ignores blocks that are entirely comments', () => {
    const input = `# just a comment\n\n# another comment`;

    const result = parseImportText(input);

    expect(result.meanings).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  test('handles all valid POS values', () => {
    const posList = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'];

    for (const pos of posList) {
      const input = `word\nслово\n${pos}|A1\nexample --- пример`;
      const result = parseImportText(input);
      expect(result.errors).toHaveLength(0);
      expect(result.meanings[0].pos).toBe(pos);
    }
  });

  test('handles all valid CEFR levels', () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    for (const level of levels) {
      const input = `word\nслово\nnoun|${level}\nexample --- пример`;
      const result = parseImportText(input);
      expect(result.errors).toHaveLength(0);
      expect(result.meanings[0].cefrLevel).toBe(level);
    }
  });
});
