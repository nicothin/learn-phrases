import { type KeyboardEvent, type ReactNode, useCallback, useRef } from 'react';

import { formatDateTime, formatDatetimeLocal, parseDatetimeLocal } from '../../../helpers';

import './DatePicker.css';

interface DatePickerProps {
  name: string;
  value: number | undefined;
  label?: string | ReactNode;
  placeholder?: string;
  className?: string;
  onChange?: (value: number | undefined) => void;
}

const DIGIT_KEYS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export const DatePicker = ({
  name,
  value,
  label,
  placeholder,
  className,
  onChange,
}: DatePickerProps) => {
  const nativeRef = useRef<HTMLInputElement>(null);

  const displayText = value !== undefined ? formatDateTime(value) : (placeholder ?? '');

  const showPicker = useCallback(() => {
    if (typeof nativeRef.current?.showPicker === 'function') {
      nativeRef.current.showPicker();
    }
  }, []);

  const handleFieldKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target === nativeRef.current) {
        return;
      }

      if (e.key === 'Enter' || DIGIT_KEYS.has(e.key)) {
        e.preventDefault();
        showPicker();
      }
    },
    [showPicker],
  );

  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      onChange?.(raw ? parseDatetimeLocal(raw) : undefined);
    },
    [onChange],
  );

  return (
    <div className={`date-picker ${className ?? ''}`}>
      {label && <span className="date-picker__label">{label}</span>}

      <div
        className="date-picker__field"
        tabIndex={0}
        role="button"
        onClick={showPicker}
        onKeyDown={handleFieldKeyDown}
      >
        <span className={`date-picker__text ${!value && placeholder ? 'date-picker__text--placeholder' : ''}`}>
          {displayText}
        </span>

        <input
          ref={nativeRef}
          className="date-picker__native"
          type="datetime-local"
          name={name}
          value={value !== undefined ? formatDatetimeLocal(value) : ''}
          onChange={handleNativeChange}
        />
      </div>
    </div>
  );
};
