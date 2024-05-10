import { SelectProps } from 'antd';

export const DEXIE_NAME = 'LearnPhrases2';
export const DEXIE_TABLE_NAME = 'phrases';
export const DEXIE_DEFAULT_FILTER_FUNC_OBJ = { func: () => true };

export const DATE_FORMAT = 'YYYY.MM.DD';
export const TAGS: SelectProps['options'] = [
  // TODO[@nicothin]: move to user Settings
  { value: 'Positive' },
  { value: 'Question' },
  { value: 'Negative' },

  { value: 'Present Simple' },
  { value: 'Present Continuous' },
  { value: 'Present Perfect' },
  { value: 'Past Simple' },
  { value: 'Future Simple' },

  { value: 'Past Continuous' },
  { value: 'Present Perfect Continuous' },
  { value: 'Future Continuous' },
  { value: 'Past Perfect' },
  { value: 'Future Perfect' },
  { value: 'Past Perfect Continuous' },
  { value: 'Future Perfect Continuous' },

  { value: 'Passive voice' },
];
