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

// export const TAGS_JSON_STRING: string = `[
//   { "value": "Positive", "color": "green" },
//   { "value": "Question", "color": "orange" },
//   { "value": "Negative", "color": "red" },
//   { "value": "Present Simple", "color": "blue" },
//   { "value": "Present Continuous", "color": "blue" },
//   { "value": "Present Perfect", "color": "blue" },
//   { "value": "Past Simple", "color": "cyan" },
//   { "value": "Future Simple", "color": "lime" },
//   { "value": "Past Continuous", "color": "cyan" },
//   { "value": "Present Perfect Continuous", "color": "blue" },
//   { "value": "Future Continuous", "color": "lime" },
//   { "value": "Past Perfect", "color": "cyan" },
//   { "value": "Future Perfect", "color": "lime" },
//   { "value": "Past Perfect Continuous", "color": "cyan" },
//   { "value": "Future Perfect Continuous", "color": "lime" },
//   { "value": "Passive voice", "color": "magenta" },
//   { "value": "Irregular verbs", "color": "magenta" }
// ]`;
