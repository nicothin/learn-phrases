import { describe, test, expect, vi, beforeEach } from 'vitest';
import { makeValidPhrase } from '../makeValidPhrase';

const withoutKey = (obj: Record<string, unknown>, key: string) => {
  const { [key]: _omit, ...rest } = obj;
  void _omit;
  return rest as typeof obj;
};

const validEntry = {
  text: 'I run every day',
  translation: 'Я бегаю каждый день',
  id: 'p1',
};

beforeEach(() => {
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('generated-uuid' as `${string}-${string}-${string}-${string}-${string}`);
});

describe('makeValidPhrase', () => {
  describe('input validation', () => {
    test('returns null for null', () => {
      expect(makeValidPhrase(null)).toBeNull();
    });

    test('returns null for non-object', () => {
      expect(makeValidPhrase('string')).toBeNull();
      expect(makeValidPhrase(42)).toBeNull();
      expect(makeValidPhrase(true)).toBeNull();
    });

    test('returns null for array', () => {
      expect(makeValidPhrase([])).toBeNull();
    });

    test('returns null when text is missing', () => {
      expect(makeValidPhrase(withoutKey(validEntry, 'text'))).toBeNull();
    });

    test('returns null when text is not a string', () => {
      expect(makeValidPhrase({ ...validEntry, text: 123 })).toBeNull();
    });

    test('returns null when text is empty string', () => {
      expect(makeValidPhrase({ ...validEntry, text: '' })).toBeNull();
    });

    test('returns null when text is whitespace', () => {
      expect(makeValidPhrase({ ...validEntry, text: '   ' })).toBeNull();
    });

    test('returns null when translation is missing', () => {
      expect(makeValidPhrase(withoutKey(validEntry, 'translation'))).toBeNull();
    });

    test('returns null when translation is not a string', () => {
      expect(makeValidPhrase({ ...validEntry, translation: false })).toBeNull();
    });

    test('returns null when translation is empty string', () => {
      expect(makeValidPhrase({ ...validEntry, translation: '' })).toBeNull();
    });
  });

  describe('textDescription field', () => {
    test('preserves valid textDescription', () => {
      const result = makeValidPhrase({ ...validEntry, textDescription: 'daily habit' });
      expect(result?.textDescription).toBe('daily habit');
    });

    test('trims textDescription', () => {
      const result = makeValidPhrase({ ...validEntry, textDescription: '  daily habit  ' });
      expect(result?.textDescription).toBe('daily habit');
    });

    test('sets textDescription to undefined when missing', () => {
      const result = makeValidPhrase(validEntry);
      expect(result?.textDescription).toBeUndefined();
    });

    test('sets textDescription to undefined when empty string', () => {
      const result = makeValidPhrase({ ...validEntry, textDescription: '' });
      expect(result?.textDescription).toBeUndefined();
    });

    test('sets textDescription to undefined when whitespace only', () => {
      const result = makeValidPhrase({ ...validEntry, textDescription: '   ' });
      expect(result?.textDescription).toBeUndefined();
    });

    test('sets textDescription to undefined when non-string', () => {
      const result = makeValidPhrase({ ...validEntry, textDescription: 123 });
      expect(result?.textDescription).toBeUndefined();
    });
  });

  describe('translationDescription field', () => {
    test('preserves valid translationDescription', () => {
      const result = makeValidPhrase({ ...validEntry, translationDescription: 'ежедневная привычка' });
      expect(result?.translationDescription).toBe('ежедневная привычка');
    });

    test('trims translationDescription', () => {
      const result = makeValidPhrase({ ...validEntry, translationDescription: '  ежедневная привычка  ' });
      expect(result?.translationDescription).toBe('ежедневная привычка');
    });

    test('sets translationDescription to undefined when missing', () => {
      const result = makeValidPhrase(validEntry);
      expect(result?.translationDescription).toBeUndefined();
    });

    test('sets translationDescription to undefined when empty string', () => {
      const result = makeValidPhrase({ ...validEntry, translationDescription: '' });
      expect(result?.translationDescription).toBeUndefined();
    });

    test('sets translationDescription to undefined when whitespace only', () => {
      const result = makeValidPhrase({ ...validEntry, translationDescription: '   ' });
      expect(result?.translationDescription).toBeUndefined();
    });

    test('sets translationDescription to undefined when non-string', () => {
      const result = makeValidPhrase({ ...validEntry, translationDescription: false });
      expect(result?.translationDescription).toBeUndefined();
    });
  });

  describe('id field', () => {
    test('preserves provided valid id', () => {
      const result = makeValidPhrase(validEntry);
      expect(result?.id).toBe('p1');
    });

    test('trims provided id', () => {
      const result = makeValidPhrase({ ...validEntry, id: '  p1  ' });
      expect(result?.id).toBe('p1');
    });

    test('generates id when missing', () => {
      const result = makeValidPhrase(withoutKey(validEntry, 'id'));
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when empty string', () => {
      const result = makeValidPhrase({ ...validEntry, id: '' });
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when whitespace', () => {
      const result = makeValidPhrase({ ...validEntry, id: '   ' });
      expect(result?.id).toBe('generated-uuid');
    });

    test('generates id when non-string', () => {
      const result = makeValidPhrase({ ...validEntry, id: null });
      expect(result?.id).toBe('generated-uuid');
    });
  });

  describe('lastShownTimestamp field', () => {
    test('sets lastShownTimestamp to undefined when missing', () => {
      const result = makeValidPhrase(validEntry);
      expect(result?.lastShownTimestamp).toBeUndefined();
    });

    test('preserves valid lastShownTimestamp', () => {
      const result = makeValidPhrase({ ...validEntry, lastShownTimestamp: 111222333 });
      expect(result?.lastShownTimestamp).toBe(111222333);
    });

    test('sets lastShownTimestamp to undefined when zero', () => {
      const result = makeValidPhrase({ ...validEntry, lastShownTimestamp: 0 });
      expect(result?.lastShownTimestamp).toBeUndefined();
    });

    test('sets lastShownTimestamp to undefined when negative', () => {
      const result = makeValidPhrase({ ...validEntry, lastShownTimestamp: -50 });
      expect(result?.lastShownTimestamp).toBeUndefined();
    });

    test('sets lastShownTimestamp to undefined when non-number', () => {
      const result = makeValidPhrase({ ...validEntry, lastShownTimestamp: 'never' });
      expect(result?.lastShownTimestamp).toBeUndefined();
    });
  });

  describe('field trimming', () => {
    test('trims text', () => {
      const result = makeValidPhrase({ ...validEntry, text: '  I run  ' });
      expect(result?.text).toBe('I run');
    });

    test('trims translation', () => {
      const result = makeValidPhrase({ ...validEntry, translation: '  бежать  ' });
      expect(result?.translation).toBe('бежать');
    });
  });

  describe('full valid phrase', () => {
    test('returns correct shape for complete entry with all fields', () => {
      const result = makeValidPhrase({
        text: 'I run every day',
        translation: 'Я бегаю каждый день',
        textDescription: 'daily habit',
        translationDescription: 'ежедневная привычка',
        lastShownTimestamp: 111222333,
        id: 'p1',
      });

      expect(result).toEqual({
        id: 'p1',
        text: 'I run every day',
        translation: 'Я бегаю каждый день',
        textDescription: 'daily habit',
        translationDescription: 'ежедневная привычка',
        lastShownTimestamp: 111222333,
      });
    });
  });
});
