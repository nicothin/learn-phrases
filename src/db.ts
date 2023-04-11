import Dexie, { Table } from 'dexie';
import { Phrase } from './types';
import { STORAGE_NAME } from './enums/storage';

export class MySubClassedDexie extends Dexie {
  phrases!: Table<Phrase>;

  constructor() {
    super(STORAGE_NAME);
    this.version(1).stores({
      phrases: 'id, first, second, firstD, secondD, myKnowledgeLvl',
    });
  }
}

export const db = new MySubClassedDexie();
