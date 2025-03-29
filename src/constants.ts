import { Replacement } from './types';

export const IDB_NAME = 'LP';
export const IDB_VERSION = 1;
export const PHRASES_TABLE_NAME = 'phrases';
export const SETTINGS_TABLE_NAME = 'settings';
export const IDB_TABLES = [
  { name: PHRASES_TABLE_NAME, keyPath: 'id' },
  { name: SETTINGS_TABLE_NAME, keyPath: 'userId' },
];

export const REPLACEMENTS: Replacement[] = [
  { search: /<[^>]+>/g, replace: '' },
  { search: /\*\*(.*?)\*\*/g, replace: '<strong>$1</strong>' },
  { search: /\*(.*?)\*/g, replace: '<em>$1</em>' },
  { search: /~~(.*?)~~/g, replace: '<del>$1</del>' },
  { search: /__(.*?)__/g, replace: '<span style="text-decoration:underline">$1</span>' },
];
