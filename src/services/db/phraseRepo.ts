import { getAll, put, remove } from './connection';
import type { ExamplePhrase } from '../../types';

const getAllPhrases = async function(): Promise<ExamplePhrase[]> {
  return getAll<ExamplePhrase>('phrases');
};

const savePhrase = async function(phrase: ExamplePhrase): Promise<void> {
  await put<ExamplePhrase>('phrases', phrase);
};

const deletePhrase = async function(id: string): Promise<void> {
  await remove('phrases', id);
};

export { getAllPhrases, savePhrase, deletePhrase };
