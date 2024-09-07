import { useEffect, useState } from 'react';

import './Rating.css';

interface RatingProps {
  maxLevel?: number;
  level?: number;
  className?: string;
  onChange?: (level: number) => void;
  isSmall?: boolean;
}

export function Rating(data: RatingProps) {
  const { maxLevel = 10, level = 0, className, onChange, isSmall } = data;

  const [selectedLevel, setSelectedLevel] = useState(level);
  const [hoverLevel, setHoverLevel] = useState(0);

  const isInteractive = typeof onChange === 'function';

  const onLevelClick = (level: number) => {
    setSelectedLevel(level);
    if (isInteractive) onChange(level);
  };

  const icons = Array.from({ length: maxLevel - 1 }, (_, index) => {
    const classes = `
      rating__item
      ${index + 1 <= selectedLevel ? 'rating__item--active' : ''}
      ${index + 1 <= hoverLevel ? 'rating__item--hover' : ''}
    `;

    return isInteractive ? (
      <button
        key={index + 1}
        onClick={isInteractive ? () => onLevelClick(index + 1) : undefined}
        className={classes}
        type="button"
        onMouseEnter={isInteractive ? () => setHoverLevel(index + 1) : undefined}
        onMouseLeave={isInteractive ? () => setHoverLevel(0) : undefined}
      >
        <svg width="18" height="18">
          <use xlinkHref="#done" />
        </svg>
      </button>
    ) : (
      <span key={index + 1} className={classes}>
        <svg width="18" height="18">
          <use xlinkHref="#done" />
        </svg>
      </span>
    );
  });

  useEffect(() => {
    setSelectedLevel(level);
  }, [level]);

  return (
    <div
      className={`
      rating
      ${isInteractive ? 'rating--interactive' : ''}
      ${isSmall ? 'rating--small' : ''}
      ${className ?? ''}
    `}
    >
      {icons}
    </div>
  );
}
