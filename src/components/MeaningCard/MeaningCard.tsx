import { useCallback, type KeyboardEvent } from 'react';
import { formatDateTime } from '../../helpers';
import { POS_LABELS } from '../../constants';
import type { Meaning } from '../../types';

import './MeaningCard.css';

interface MeaningCardProps {
  meaning: Meaning;
  onClick?: () => void;
}

export function MeaningCard({ meaning, onClick }: MeaningCardProps) {
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
      className="meaning-card"
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <p className="meaning-card__lemma">{meaning.lemma}</p>
      <div className="meaning-card__translation">{meaning.translation}</div>
      <div className="meaning-card__meta">
        <span>{POS_LABELS[meaning.pos]}</span>
        <span className="meaning-card__dot">·</span>
        <span>{meaning.cefrLevel}</span>
      </div>
      <div className="meaning-card__meta">
        <span>Level {meaning.knowledgeLvl}/8</span>
        {meaning.showAfterTimestamp && (
          <>
            <span className="meaning-card__dot">·</span>
            <span>{formatDateTime(meaning.showAfterTimestamp)}</span>
          </>
        )}
      </div>
    </div>
  );
}
