import React from 'react';

import { REPLACEMENTS } from '../../constants';

interface MarkdownRendererProps {
  children: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ children }) => {
  const renderMarkdown = (text: string): JSX.Element => {
    const transformedText = REPLACEMENTS.reduce((acc, { search, replace }) => {
      return acc.replace(search, replace);
    }, text);

    const parts = transformedText.split(/\n/);

    return (
      <>
        {parts
          .filter((part) => !!part)
          .map((part, index) => {
            if (part.startsWith('# '))
              return <h2 key={index} dangerouslySetInnerHTML={{ __html: part.replace(/^#\s/, '') }} />;
            else if (part.startsWith('## '))
              return <h2 key={index} dangerouslySetInnerHTML={{ __html: part.replace(/^##\s/, '') }} />;
            else if (part.startsWith('### '))
              return <h2 key={index} dangerouslySetInnerHTML={{ __html: part.replace(/^###\s/, '') }} />;

            return <p key={index} dangerouslySetInnerHTML={{ __html: part }} />;
          })}
      </>
    );
  };

  return renderMarkdown(children);
});
