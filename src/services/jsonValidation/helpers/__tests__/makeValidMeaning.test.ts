import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeValidMeaning } from '../makeValidMeaning';

const withoutKey = (obj: Record<string, unknown>, key: string) => {
  const { [key]: _omit, ...rest } = obj;
  void _omit;
  return rest as typeof obj;
};

const validEntry = {
  lemma: 'run',
  translation: 'бежать',
  pos: 'verb',
  cefrLevel: 'A1',
  exampleIds: [],
  id: 'm1',
};

const emptyPhraseIds = new Set<string>();
const phraseIdsWithM1 = new Set<string>(['p1']);

beforeEach(() => {
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('generated-uuid' as `${string}-${string}-${string}-${string}-${string}`);
});

describe('makeValidMeaning', () => {
  describe('input validation', () => {
    test('returns null for null', () => {
      expect(makeValidMeaning(null, emptyPhraseIds)).toBeNull();
    });

    test('returns null for non-object', () => {
      expect(makeValidMeaning('string', emptyPhraseIds)).toBeNull();
      expect(makeValidMeaning(42, emptyPhraseIds)).toBeNull();
      expect(makeValidMeaning(true, emptyPhraseIds)).toBeNull();
    });

    test('returns null for array', () => {
      expect(makeValidMeaning([], emptyPhraseIds)).toBeNull();
    });

    test('returns null when lemma is missing', () => {
      expect(makeValidMeaning(withoutKey(validEntry, 'lemma'), emptyPhraseIds)).toBeNull();
    });

    test('returns null when lemma is not a string', () => {
      expect(makeValidMeaning({ ...validEntry, lemma: 123 }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when lemma is empty string', () => {
      expect(makeValidMeaning({ ...validEntry, lemma: '' }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when lemma is whitespace', () => {
      expect(makeValidMeaning({ ...validEntry, lemma: '   ' }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when translation is missing', () => {
      expect(makeValidMeaning(withoutKey(validEntry, 'translation'), emptyPhraseIds)).toBeNull();
    });

    test('returns null when translation is not a string', () => {
      expect(makeValidMeaning({ ...validEntry, translation: false }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when pos is invalid', () => {
      expect(makeValidMeaning({ ...validEntry, pos: 'invalid' }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when pos is missing', () => {
      expect(makeValidMeaning(withoutKey(validEntry, 'pos'), emptyPhraseIds)).toBeNull();
    });

    test('returns null when cefrLevel is invalid', () => {
      expect(makeValidMeaning({ ...validEntry, cefrLevel: 'Z9' }, emptyPhraseIds)).toBeNull();
    });

    test('returns null when cefrLevel is missing', () => {
      expect(makeValidMeaning(withoutKey(validEntry, 'cefrLevel'), emptyPhraseIds)).toBeNull();
    });

    test('returns null when cefrLevel is wrong type', () => {
      expect(makeValidMeaning({ ...validEntry, cefrLevel: 123 }, emptyPhraseIds)).toBeNull();
    });
  });

  describe('description field', () => {
    test('preserves valid description', () => {
      const result = makeValidMeaning({ ...validEntry, description: 'run fast' }, emptyPhraseIds);
      expect(result?.description).toBe('run fast');
    });

    test('trims description', () => {
      const result = makeValidMeaning({ ...validEntry, description: '  run fast  ' }, emptyPhraseIds);
      expect(result?.description).toBe('run fast');
    });

    test('sets description to undefined when missing', () => {
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      expect(result?.description).toBeUndefined();
    });

    test('sets description to undefined when empty string', () => {
      const result = makeValidMeaning({ ...validEntry, description: '' }, emptyPhraseIds);
      expect(result?.description).toBeUndefined();
    });

    test('sets description to undefined when whitespace only', () => {
      const result = makeValidMeaning({ ...validEntry, description: '   ' }, emptyPhraseIds);
      expect(result?.description).toBeUndefined();
    });

    test('sets description to undefined when non-string', () => {
      const result = makeValidMeaning({ ...validEntry, description: 123 }, emptyPhraseIds);
      expect(result?.description).toBeUndefined();
    });
  });

  describe('id field', () => {
    test('preserves provided valid id', () => {
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      expect(result?.id).toBe('m1');
    });

    test('trims provided id', () => {
      const result = makeValidMeaning({ ...validEntry, id: '  m1  ' }, emptyPhraseIds);
      expect(result?.id).toBe('m1');
    });

    test('generates id when missing', () => {
      const result = makeValidMeaning(withoutKey(validEntry, 'id'), emptyPhraseIds);
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when empty string', () => {
      const result = makeValidMeaning({ ...validEntry, id: '' }, emptyPhraseIds);
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when whitespace', () => {
      const result = makeValidMeaning({ ...validEntry, id: '   ' }, emptyPhraseIds);
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when non-string', () => {
      const result = makeValidMeaning({ ...validEntry, id: null }, emptyPhraseIds);
      expect(result?.id).toBe('generated-uuid');
    });
  });

  describe('exampleIds field', () => {
    test('filters exampleIds to only valid phrase IDs', () => {
      const result = makeValidMeaning(
        { ...validEntry, exampleIds: ['p1', 'p2', 'p3'] },
        phraseIdsWithM1,
      );
      expect(result?.exampleIds).toEqual(['p1']);
    });

    test('sets exampleIds to empty array when input is not an array', () => {
      const result = makeValidMeaning({ ...validEntry, exampleIds: 'not-array' }, emptyPhraseIds);
      expect(result?.exampleIds).toEqual([]);
    });

    test('sets exampleIds to empty array when input is null', () => {
      const result = makeValidMeaning({ ...validEntry, exampleIds: null }, emptyPhraseIds);
      expect(result?.exampleIds).toEqual([]);
    });

    test('preserves empty exampleIds', () => {
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      expect(result?.exampleIds).toEqual([]);
    });
  });

  describe('field trimming', () => {
    test('trims lemma', () => {
      const result = makeValidMeaning({ ...validEntry, lemma: '  run  ' }, emptyPhraseIds);
      expect(result?.lemma).toBe('run');
    });

    test('trims translation', () => {
      const result = makeValidMeaning({ ...validEntry, translation: '  бежать  ' }, emptyPhraseIds);
      expect(result?.translation).toBe('бежать');
    });
  });

  describe('knowledgeLvl field', () => {
    test('defaults to 1 when missing', () => {
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      expect(result?.knowledgeLvl).toBe(1);
    });

    test('preserves valid knowledgeLvl', () => {
      const result = makeValidMeaning({ ...validEntry, knowledgeLvl: 5 }, emptyPhraseIds);
      expect(result?.knowledgeLvl).toBe(5);
    });

    test('defaults to 1 when knowledgeLvl is 0', () => {
      const result = makeValidMeaning({ ...validEntry, knowledgeLvl: 0 }, emptyPhraseIds);
      expect(result?.knowledgeLvl).toBe(1);
    });

    test('defaults to 1 when knowledgeLvl is 9', () => {
      const result = makeValidMeaning({ ...validEntry, knowledgeLvl: 9 }, emptyPhraseIds);
      expect(result?.knowledgeLvl).toBe(1);
    });

    test('defaults to 1 when knowledgeLvl is not a number', () => {
      const result = makeValidMeaning({ ...validEntry, knowledgeLvl: 'high' }, emptyPhraseIds);
      expect(result?.knowledgeLvl).toBe(1);
    });
  });

  describe('showAfterTimestamp field', () => {
    test('sets showAfterTimestamp to current time when missing', () => {
      const before = Date.now();
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      const after = Date.now();
      expect(result?.showAfterTimestamp).toBeGreaterThanOrEqual(before);
      expect(result?.showAfterTimestamp).toBeLessThanOrEqual(after);
    });

    test('preserves valid showAfterTimestamp', () => {
      const result = makeValidMeaning({ ...validEntry, showAfterTimestamp: 123456789 }, emptyPhraseIds);
      expect(result?.showAfterTimestamp).toBe(123456789);
    });

    test('resets showAfterTimestamp when value is negative', () => {
      const before = Date.now();
      const result = makeValidMeaning({ ...validEntry, showAfterTimestamp: -1 }, emptyPhraseIds);
      const after = Date.now();
      expect(result?.showAfterTimestamp).toBeGreaterThanOrEqual(before);
      expect(result?.showAfterTimestamp).toBeLessThanOrEqual(after);
    });

    test('resets showAfterTimestamp when value is non-number', () => {
      const before = Date.now();
      const result = makeValidMeaning({ ...validEntry, showAfterTimestamp: 'invalid' }, emptyPhraseIds);
      const after = Date.now();
      expect(result?.showAfterTimestamp).toBeGreaterThanOrEqual(before);
      expect(result?.showAfterTimestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('lastShowTimestamp field', () => {
    test('sets lastShowTimestamp to undefined when missing', () => {
      const result = makeValidMeaning(validEntry, emptyPhraseIds);
      expect(result?.lastShowTimestamp).toBeUndefined();
    });

    test('preserves valid lastShowTimestamp', () => {
      const result = makeValidMeaning({ ...validEntry, lastShowTimestamp: 987654321 }, emptyPhraseIds);
      expect(result?.lastShowTimestamp).toBe(987654321);
    });

    test('sets lastShowTimestamp to undefined when zero', () => {
      const result = makeValidMeaning({ ...validEntry, lastShowTimestamp: 0 }, emptyPhraseIds);
      expect(result?.lastShowTimestamp).toBeUndefined();
    });

    test('sets lastShowTimestamp to undefined when negative', () => {
      const result = makeValidMeaning({ ...validEntry, lastShowTimestamp: -100 }, emptyPhraseIds);
      expect(result?.lastShowTimestamp).toBeUndefined();
    });

    test('sets lastShowTimestamp to undefined when non-number', () => {
      const result = makeValidMeaning({ ...validEntry, lastShowTimestamp: 'never' }, emptyPhraseIds);
      expect(result?.lastShowTimestamp).toBeUndefined();
    });
  });

  describe('full valid meaning', () => {
    test('returns correct shape for complete entry with all fields', () => {
      const result = makeValidMeaning({
        lemma: 'run',
        translation: 'бежать',
        description: 'move quickly',
        pos: 'verb',
        cefrLevel: 'A1',
        exampleIds: ['p1'],
        id: 'm1',
        knowledgeLvl: 5,
        showAfterTimestamp: 1000,
        lastShowTimestamp: 2000,
      }, new Set(['p1']));

      expect(result).toEqual({
        id: 'm1',
        lemma: 'run',
        translation: 'бежать',
        description: 'move quickly',
        pos: 'verb',
        cefrLevel: 'A1',
        exampleIds: ['p1'],
        knowledgeLvl: 5,
        showAfterTimestamp: 1000,
        lastShowTimestamp: 2000,
      });
    });
  });
});
