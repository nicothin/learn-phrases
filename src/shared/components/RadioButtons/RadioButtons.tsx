import { type ReactNode } from 'react';

import './RadioButtons.css';

const DEFAULT_MIN_CELL_WIDTH = '120px';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CellWidth {
  min: string;
  max?: string;
}

interface RadioButtonsProps {
  name: string;
  value: string;
  options: RadioOption[];
  label?: string | ReactNode;
  cellWidth?: string | CellWidth;
  className?: string;
  onChange?: (value: string) => void;
}

function resolveCellWidth(cellWidth: string | CellWidth | undefined): string {
  if (!cellWidth || typeof cellWidth === 'string') {
    return `repeat(auto-fill, minmax(${cellWidth || DEFAULT_MIN_CELL_WIDTH}, 1fr))`;
  }
  const min = cellWidth.min;
  const max = cellWidth.max ?? '1fr';
  return `repeat(auto-fill, minmax(${min}, ${max}))`;
}

export const RadioButtons = ({
  name,
  value,
  options,
  label,
  cellWidth,
  className,
  onChange,
}: RadioButtonsProps) => {
  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  const gridStyle = {
    gridTemplateColumns: resolveCellWidth(cellWidth),
  } as React.CSSProperties;

  return (
    <div className={`radio-buttons ${className ?? ''}`}>
      {label && <span className="radio-buttons__label">{label}</span>}

      <div className="radio-buttons__list" role="group" style={gridStyle}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`radio-buttons__option ${option.disabled ? 'radio-buttons__option--disabled' : ''}`}
          >
            <span className="radio-buttons__control">
              <input
                className="radio-buttons__input"
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                onChange={() => handleChange(option.value)}
              />
              <span className="radio-buttons__text">{option.label}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
