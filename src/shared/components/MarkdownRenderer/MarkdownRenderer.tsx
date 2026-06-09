import { memo, type ReactNode } from 'react';

interface MarkdownRendererProps {
  children: string;
  inlineSuffix?: ReactNode;
}

function parseInline(text: string): ReactNode {
  const boldRe = /\*\*(.+?)\*\*/d;
  const strikeRe = /~~(.+?)~~/d;

  const boldMatch = boldRe.exec(text);
  const strikeMatch = strikeRe.exec(text);

  const match =
    boldMatch && strikeMatch
      ? boldMatch.index <= strikeMatch.index ? boldMatch : strikeMatch
      : boldMatch ?? strikeMatch;

  if (!match) return text;

  const before = text.slice(0, match.index);
  const inner = match[1];
  const after = text.slice(match.index + match[0].length);
  const Tag = match[0].startsWith('**') ? 'strong' : 'del';

  return (
    <>
      {before}
      <Tag>{parseInline(inner)}</Tag>
      {parseInline(after)}
    </>
  );
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  children,
  inlineSuffix,
}: MarkdownRendererProps) {
  const lines = children.split('\n');

  const paragraphs = lines
    .map((line, i) => ({ text: line.trim(), i }))
    .filter(({ text }) => text.length > 0);

  if (paragraphs.length === 0) {
    return inlineSuffix ? <>{inlineSuffix}</> : null;
  }

  return (
    <>
      {paragraphs.map(({ text, i }, arrayIndex) => {
        const isLast = arrayIndex === paragraphs.length - 1;
        return (
          <p key={i}>
            {parseInline(text)}
            {isLast && inlineSuffix && <> {inlineSuffix}</>}
          </p>
        );
      })}
    </>
  );
});
