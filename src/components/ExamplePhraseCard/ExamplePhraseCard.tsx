import { useCallback, type KeyboardEvent } from 'react';
import { MarkdownRenderer } from '@shared/components';
import type { ExamplePhrase } from '../../types';

import './ExamplePhraseCard.css';

interface ExamplePhraseCardProps {
  phrase: ExamplePhrase;
  onClick?: () => void;
}

export function ExamplePhraseCard({ phrase, onClick }: ExamplePhraseCardProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  return (
    <div
      className="example-phrase-card"
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="example-phrase-card__text">
        <MarkdownRenderer>{phrase.text}</MarkdownRenderer>
      </div>
      {phrase.textDescription && (
        <div className="example-phrase-card__description">
          <MarkdownRenderer>{phrase.textDescription}</MarkdownRenderer>
        </div>
      )}
      <div className="example-phrase-card__translation">
        <MarkdownRenderer>{phrase.translation}</MarkdownRenderer>
      </div>
      {phrase.translationDescription && (
        <div className="example-phrase-card__description">
          <MarkdownRenderer>{phrase.translationDescription}</MarkdownRenderer>
        </div>
      )}
    </div>
  );
}
