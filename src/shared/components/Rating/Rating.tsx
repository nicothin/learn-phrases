import { useState } from 'react';

import { Icon } from '../Icon/Icon';

import './Rating.css';

interface RatingProps {
  minLevel?: number;
  maxLevel?: number;
  level?: number;
  label?: string;
  className?: string;
  onChange?: (level: number) => void;
}

export function Rating({ minLevel = 1, maxLevel = 10, level = 0, label, className, onChange }: RatingProps) {
  const [hoverLevel, setHoverLevel] = useState(0);

  if (maxLevel < minLevel) {
    console.error(`Rating: maxLevel (${maxLevel}) is less than minLevel (${minLevel})`);
    return null;
  }

  const currentLevel = hoverLevel || level;

  const isInteractive = onChange != null;

  const ratingClasses = ['rating', isInteractive && 'rating--interactive', className]
    .filter(Boolean)
    .join(' ');

  const rangeLength = maxLevel - minLevel + 1;

  const items = Array.from({ length: rangeLength }, (_, index) => {
    const itemLevel = index + minLevel;
    const itemClasses = [
      'rating__item',
      itemLevel <= currentLevel && 'rating__item--active',
      itemLevel <= hoverLevel && 'rating__item--hover',
    ]
      .filter(Boolean)
      .join(' ');

    const commonProps = {
      className: itemClasses,
      'data-testid': 'rating__item',
    };

    if (isInteractive) {
      return (
        <button
          key={itemLevel}
          {...commonProps}
          type="button"
          onClick={() => onChange?.(itemLevel)}
          onMouseEnter={() => setHoverLevel(itemLevel)}
          onMouseLeave={() => setHoverLevel(0)}
        >
          <Icon name="done" />
        </button>
      );
    }

    return (
      <span key={itemLevel} {...commonProps}>
        <Icon name="done" />
      </span>
    );
  });

  return (
    <div className={ratingClasses}>
      {label && <span className="rating__label">{label}</span>}
      <span className="rating__items">{items}</span>
    </div>
  );
}
