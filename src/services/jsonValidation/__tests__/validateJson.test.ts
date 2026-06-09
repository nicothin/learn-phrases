import { describe, test, expect, beforeEach, vi } from 'vitest';
import { validateJson, makeValidMeaning, makeValidPhrase } from '../validateJson';

beforeEach(() => {
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000000');
});

describe('makeValidMeaning', () => {
  test('returns null for non-object input', () => {
    expect(makeValidMeaning(null)).toBeNull();
    expect(makeValidMeaning('string')).toBeNull();
    expect(makeValidMeaning(123)).toBeNull();
    expect(makeValidMeaning([])).toBeNull();
  });

  test('returns null when lemma is missing or empty', () => {
    expect(makeValidMeaning({ translation: 'стол', pos: 'noun', cefrLevel: 'A1' })).toBeNull();

    expect(makeValidMeaning({ lemma: '', translation: 'стол', pos: 'noun', cefrLevel: 'A1' })).toBeNull();

    expect(makeValidMeaning({ lemma: '  ', translation: 'стол', pos: 'noun', cefrLevel: 'A1' })).toBeNull();
  });

  test('returns null when translation is missing or empty', () => {
    expect(makeValidMeaning({ lemma: 'table', pos: 'noun', cefrLevel: 'A1' })).toBeNull();

    expect(makeValidMeaning({ lemma: 'table', translation: '', pos: 'noun', cefrLevel: 'A1' })).toBeNull();

    expect(makeValidMeaning({ lemma: 'table', translation: '  ', pos: 'noun', cefrLevel: 'A1' })).toBeNull();
  });

  test('returns null when pos is not a valid PartOfSpeech', () => {
    expect(makeValidMeaning({ lemma: 'table', translation: 'стол', pos: 'invalid', cefrLevel: 'A1' })).toBeNull();
  });

  test('returns null when cefrLevel is not a valid CEFR level', () => {
    expect(makeValidMeaning({ lemma: 'table', translation: 'стол', pos: 'noun', cefrLevel: 'A3' })).toBeNull();
  });

  test('returns a valid Meaning object for correct input', () => {
    const result = makeValidMeaning({ lemma: 'table', translation: 'стол', pos: 'noun', cefrLevel: 'A1' });

    expect(result).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
      lemma: 'table',
      translation: 'стол',
      pos: 'noun',
      cefrLevel: 'A1',
      exampleIds: [],
      knowledgeLvl: 1,
      showAfterTimestamp: expect.any(Number),
    });
  });

  test('trims whitespace from lemma and translation', () => {
    const result = makeValidMeaning({ lemma: '  table  ', translation: '  стол  ', pos: 'noun', cefrLevel: 'A1' });

    expect(result).toMatchObject({ lemma: 'table', translation: 'стол' });
  });
});

describe('makeValidPhrase', () => {
  test('returns null for non-object input', () => {
    expect(makeValidPhrase(null)).toBeNull();
    expect(makeValidPhrase('string')).toBeNull();
    expect(makeValidPhrase(123)).toBeNull();
    expect(makeValidPhrase([])).toBeNull();
  });

  test('returns null when text is missing or empty', () => {
    expect(makeValidPhrase({ translation: 'это стол' })).toBeNull();

    expect(makeValidPhrase({ text: '', translation: 'это стол' })).toBeNull();

    expect(makeValidPhrase({ text: '  ', translation: 'это стол' })).toBeNull();
  });

  test('returns null when translation is missing or empty', () => {
    expect(makeValidPhrase({ text: 'this is a table' })).toBeNull();

    expect(makeValidPhrase({ text: 'this is a table', translation: '' })).toBeNull();

    expect(makeValidPhrase({ text: 'this is a table', translation: '  ' })).toBeNull();
  });

  test('returns a valid ExamplePhrase for correct input', () => {
    const result = makeValidPhrase({ text: 'this is a table', translation: 'это стол' });

    expect(result).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
      text: 'this is a table',
      translation: 'это стол',
    });
  });

  test('trims whitespace from text and translation', () => {
    const result = makeValidPhrase({ text: '  this is a table  ', translation: '  это стол  ' });

    expect(result).toEqual({ id: '00000000-0000-0000-0000-000000000000', text: 'this is a table', translation: 'это стол' });
  });
});

describe('validateJson', () => {
  test('returns error for invalid JSON string', () => {
    const result = validateJson('not json');

    expect(result.data).toBeNull();
    expect(result.log).toEqual([
      { type: 'ERROR', message: 'Invalid JSON', details: expect.any(String) },
    ]);
  });

  test('returns error when root value is not an object', () => {
    const result = validateJson('[]');

    expect(result.data).toBeNull();
    expect(result.log).toEqual([
      { type: 'ERROR', message: 'Root value must be a JSON object' },
    ]);
  });

  test('returns error when both meanings and phrases are missing', () => {
    const result = validateJson('{}');

    expect(result.data).toBeNull();
    expect(result.log).toEqual([
      { type: 'ERROR', message: 'Missing required fields: meanings, phrases' },
    ]);
  });

  test('returns data with empty arrays when meanings and phrases are empty arrays', () => {
    const result = validateJson('{"meanings":[],"phrases":[]}');

    expect(result.data).toEqual({
      meta: { version: '' },
      meanings: [],
      phrases: [],
    });
    expect(result.log).toEqual([]);
  });

  test('returns data when only meanings is present', () => {
    const result = validateJson(JSON.stringify({ meanings: [] }));

    expect(result.data).toEqual({
      meta: { version: '' },
      meanings: [],
      phrases: [],
    });
    expect(result.log).toEqual([]);
  });

  test('returns data when only phrases is present', () => {
    const result = validateJson(JSON.stringify({ phrases: [] }));

    expect(result.data).toEqual({
      meta: { version: '' },
      meanings: [],
      phrases: [],
    });
    expect(result.log).toEqual([]);
  });

  test('validates all meaning items and returns valid ones', () => {
    const json = JSON.stringify({
      meanings: [
        { lemma: 'table', translation: 'стол', pos: 'noun', cefrLevel: 'A1' },
        { lemma: 'book', translation: 'книга', pos: 'noun', cefrLevel: 'A2' },
      ],
    });

    const result = validateJson(json);

    expect(result.data?.meanings).toHaveLength(2);
    expect(result.log).toEqual([]);
  });

  test('reports invalid meaning items and skips them', () => {
    const json = JSON.stringify({
      meanings: [
        { lemma: 'table', translation: 'стол', pos: 'noun', cefrLevel: 'A1' },
        { lemma: '', translation: 'книга', pos: 'noun', cefrLevel: 'A2' },
      ],
    });

    const result = validateJson(json);

    expect(result.data?.meanings).toHaveLength(1);
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'meanings[1] has invalid structure',
    });
  });

  test('validates all phrase items and returns valid ones', () => {
    const json = JSON.stringify({
      phrases: [
        { text: 'this is a table', translation: 'это стол' },
        { text: 'this is a book', translation: 'это книга' },
      ],
    });

    const result = validateJson(json);

    expect(result.data?.phrases).toHaveLength(2);
    expect(result.log).toEqual([]);
  });

  test('reports invalid phrase items and skips them', () => {
    const json = JSON.stringify({
      phrases: [
        { text: 'this is a table', translation: 'это стол' },
        { text: '', translation: 'это книга' },
      ],
    });

    const result = validateJson(json);

    expect(result.data?.phrases).toHaveLength(1);
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'phrases[1] has invalid structure',
    });
  });

  test('extracts meta.version when present', () => {
    const json = JSON.stringify({
      meta: { version: '2.0' },
      meanings: [],
    });

    const result = validateJson(json);

    expect(result.data?.meta).toEqual({ version: '2.0' });
  });

  test('defaults meta.version to empty string when meta is missing', () => {
    const result = validateJson(JSON.stringify({ meanings: [] }));

    expect(result.data?.meta).toEqual({ version: '' });
  });

  test('defaults meta.version to empty string when meta.version is not a string', () => {
    const result = validateJson(JSON.stringify({ meta: { version: 123 }, meanings: [] }));

    expect(result.data?.meta).toEqual({ version: '' });
  });
});
