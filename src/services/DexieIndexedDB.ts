import Dexie, { Table } from 'dexie';

import { Phrase } from '../types';
import { DEXIE_NAME, DEXIE_TABLE_NAME } from '../constants';

export class DexieSubClass extends Dexie {
  phrases!: Table<Phrase>;

  constructor() {
    super(DEXIE_NAME);
    this.version(1).stores({
      [DEXIE_TABLE_NAME]: '++id, first, firstD, second, secondD, knowledgeLvl, createDate, tags',
    });
  }
}

export const DexieIndexedDB = new DexieSubClass();
