import { Fragment } from 'react';
import { Conflict, Phrase } from '../../types';

export const getClass = (conflict: Conflict, field: keyof Phrase): string => `
  resolver__text
  resolver__text--${field}
  ${conflict.differentFields.includes(field) ? 'resolver__text--accent' : ''}
`;

export const getTextWithBreaks = (text: string | undefined): JSX.Element[] | null => {
  if (!text) return null;
  return text.split('\n\n').map((part, index) => (
    <Fragment key={index}>
      {part} {index < text.split('\n\n').length - 1 && <br />}
    </Fragment>
  ));
};
