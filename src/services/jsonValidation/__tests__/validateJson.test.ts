import { validateJson } from '../validateJson';

describe('validateJson', () => {
  test('returns error for invalid JSON', () => {
    const result = validateJson('{ invalid json');
    expect(result.data).toBeNull();
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'Invalid JSON',
    });
  });

  test('returns error for valid JSON but root is not an object', () => {
    const result = validateJson('[1, 2, 3]');
    expect(result.data).toBeNull();
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'Root value must be a JSON object',
    });
  });

  test('returns error for valid JSON object missing meanings and phrases', () => {
    const result = validateJson('{}');
    expect(result.data).toBeNull();
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'Missing required fields: meanings, phrases',
    });
  });

  test('returns error for valid JSON object with only meta', () => {
    const result = validateJson('{"meta": {"version": "1.0"}}');
    expect(result.data).toBeNull();
    expect(result.log).toHaveLength(1);
    expect(result.log[0]).toMatchObject({
      type: 'ERROR',
      message: 'Missing required fields: meanings, phrases',
    });
  });

  test('valid JSON with only meanings (no phrases)', () => {
    const json = JSON.stringify({
      meanings: [
        {
          lemma: 'test',
          translation: 'тест',
          pos: 'noun',
          cefrLevel: 'A1',
          exampleIds: [],
          id: '1',
        },
      ],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meanings).toHaveLength(1);
    expect(result.data?.phrases).toHaveLength(0);
    expect(result.log).toHaveLength(0);
  });

  test('valid JSON with only phrases (no meanings)', () => {
    const json = JSON.stringify({
      phrases: [
        {
          text: 'Hello world',
          translation: 'Привет мир',
          id: 'p1',
        },
      ],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meanings).toHaveLength(0);
    expect(result.data?.phrases).toHaveLength(1);
    expect(result.log).toHaveLength(0);
  });

  test('valid JSON with both meanings and phrases, all valid', () => {
    const json = JSON.stringify({
      meanings: [
        {
          lemma: 'run',
          translation: 'бежать',
          pos: 'verb',
          cefrLevel: 'A1',
          exampleIds: ['ex1'],
          id: 'm1',
        },
      ],
      phrases: [
        {
          text: 'I run every day',
          translation: 'Я бегаю каждый день',
          id: 'ex1',
        },
      ],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meanings).toHaveLength(1);
    expect(result.data?.phrases).toHaveLength(1);
    expect(result.data?.meanings[0].exampleIds).toEqual(['ex1']);
    expect(result.log).toHaveLength(0);
  });

  test('filters out invalid meanings and phrases', () => {
    const json = JSON.stringify({
      meanings: [
        {
          lemma: 'valid',
          translation: 'валид',
          pos: 'adjective',
          cefrLevel: 'B1',
          exampleIds: ['p1'],
          id: 'm1',
        },
        {
          // missing lemma
          translation: 'invalid',
          pos: 'noun',
          cefrLevel: 'A2',
          exampleIds: [],
          id: 'm2',
        },
      ],
      phrases: [
        {
          text: 'Valid phrase',
          translation: 'Валидная фраза',
          id: 'p1',
        },
        {
          // missing text
          translation: 'Invalid phrase',
          id: 'p2',
        },
      ],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meanings).toHaveLength(1);
    expect(result.data?.meanings[0].lemma).toBe('valid');
    expect(result.data?.phrases).toHaveLength(1);
    expect(result.data?.phrases[0].text).toBe('Valid phrase');
    // Expect errors for invalid entries (order may vary)
    expect(result.log).toHaveLength(2);
    const logMessages = result.log.map(l => l.message);
    expect(logMessages).toContain('meanings[1] has invalid structure');
    expect(logMessages).toContain('phrases[1] has invalid structure');
  });

  test('exampleIds are filtered to only valid phrase IDs', () => {
    const json = JSON.stringify({
      meanings: [
        {
          lemma: 'test',
          translation: 'тест',
          pos: 'noun',
          cefrLevel: 'A1',
          exampleIds: ['validId', 'invalidId'],
          id: 'm1',
        },
      ],
      phrases: [
        {
          text: 'Valid phrase',
          translation: 'Валидная фраза',
          id: 'validId',
        },
        // invalid phrase missing translation
        {
          text: 'Invalid phrase',
          id: 'invalidId',
        },
      ],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meanings[0].exampleIds).toEqual(['validId']);
    expect(result.data?.phrases).toHaveLength(1);
    expect(result.log).toHaveLength(1); // error for invalid phrase
  });

  test('meta version is captured', () => {
    const json = JSON.stringify({
      meta: {
        version: '2.3.0',
      },
      meanings: [],
      phrases: [],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meta.version).toBe('2.3.0');
  });

  test('missing meta version defaults to empty string', () => {
    const json = JSON.stringify({
      meanings: [],
      phrases: [],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meta.version).toBe('');
  });

  test('meta version is not a string defaults to empty string', () => {
    const json = JSON.stringify({
      meta: {
        version: 123,
      },
      meanings: [],
      phrases: [],
    });
    const result = validateJson(json);
    expect(result.data).not.toBeNull();
    expect(result.data?.meta.version).toBe('');
  });
});