import { getAll, put, remove } from './connection';
import type { Meaning } from '../../types';

const getAllMeanings = async function(): Promise<Meaning[]> {
  return getAll<Meaning>('meanings');
};

const saveMeaning = async function(meaning: Meaning): Promise<void> {
  await put<Meaning>('meanings', meaning);
};

const deleteMeaning = async function(id: string): Promise<void> {
  await remove('meanings', id);
};

export { getAllMeanings, saveMeaning, deleteMeaning };
