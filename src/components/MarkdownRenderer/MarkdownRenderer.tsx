import { FC, memo, ReactNode } from 'react';

import { REPLACEMENTS } from '../../constants';

interface MarkdownRendererProps {
  children: string;
  inlineSuffix?: ReactNode;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = memo(({ children, inlineSuffix }) => {
  const renderMarkdown = (text: string): JSX.Element => {
    const transformedText = REPLACEMENTS.reduce(
      (acc, { search, replace }) => acc.replace(search, replace),
      text,
    );

    const parts = transformedText
      .split(/\n/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      return <>{inlineSuffix}</>;
    }

    return (
      <>
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;

          let htmlContent: string = '';
          let Tag: keyof JSX.IntrinsicElements = 'p';

          if (part.startsWith('# ')) {
            htmlContent = part.replace(/^#\s/, '');
            Tag = 'h2';
          } else if (part.startsWith('## ')) {
            htmlContent = part.replace(/^##\s/, '');
            Tag = 'h3';
          } else if (part.startsWith('### ')) {
            htmlContent = part.replace(/^###\s/, '');
            Tag = 'h4';
          } else {
            htmlContent = part;
            Tag = 'p';
          }

          const content = (
            <>
              <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
              {isLast && inlineSuffix && <> {inlineSuffix}</>}
            </>
          );

          return <Tag key={index}>{content}</Tag>;
        })}
      </>
    );
  };

  return renderMarkdown(children);
});
