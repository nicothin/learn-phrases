import { type ChangeEvent, type ReactNode, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './MultiSelect.css';

import { Tag } from '../Tag/Tag';
import { useMultiSelect, type MultiSelectOption } from './useMultiSelect';

export type { MultiSelectOption };

export interface MultiSelectProps {
  name: string;
  label?: string;
  description?: string | ReactNode;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  errorMessage?: string | ReactNode;
  portalTarget?: HTMLElement | null;
  initialInputValue?: string;
  searchThreshold?: number;
  debounceMs?: number;
  fallbackOptions?: MultiSelectOption[];
  searchHint?: string;
  onTagClick?: (value: string) => void;
}

export function MultiSelect({
  name,
  label,
  description,
  options = [],
  value,
  onChange,
  placeholder,
  className,
  disabled,
  errorMessage,
  portalTarget,
  initialInputValue,
  searchThreshold,
  debounceMs,
  fallbackOptions,
  searchHint,
  onTagClick,
}: MultiSelectProps) {
  const {
    inputValue,
    isOpen,
    highlightedIndex,
    dropdownStyle,
    isPositioned,
    wrapperRef,
    inputRef,
    listRef,
    filteredOptions,
    close,
    open,
    addValue,
    removeValue,
    handleInputChange,
    handleInputKeyDown,
  } = useMultiSelect({
    options,
    value,
    onChange,
    disabled,
    initialInputValue,
    searchThreshold,
    debounceMs,
    fallbackOptions,
  });

  const handleInputChangeEvent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(e.target.value);
    },
    [handleInputChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInsideWrapper = wrapperRef.current?.contains(target) ?? false;
      const isInsideList = listRef.current?.contains(target) ?? false;

      if (!isInsideWrapper && !isInsideList) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [close, wrapperRef, listRef]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;

    const item = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [highlightedIndex, isOpen, listRef]);


  const wrapperClasses = ['multiselect', className].filter(Boolean).join(' ');

  const showSearchHint = searchHint && searchThreshold && searchThreshold > 0 && inputValue.length < searchThreshold;

  const dropdown = isOpen ? (
    filteredOptions.length > 0 ? (
      <ul
        ref={listRef}
        id={`${name}-listbox`}
        className={`multiselect__list${!isPositioned ? ' multiselect__list--hidden' : ''}`}
        role="listbox"
        style={dropdownStyle}
      >
        {filteredOptions.map((opt, index) => (
          <li
            key={opt.value}
            role="option"
            aria-selected={false}
            className={`multiselect__option ${index === highlightedIndex ? 'multiselect__option--highlighted' : ''}`}
            onClick={() => addValue(opt.value)}

          >
            <span className="multiselect__option-label">{opt.label}</span>
            {opt.description && <span className="multiselect__option-description">{opt.description}</span>}
          </li>
        ))}
      </ul>
    ) : (
      <div className="multiselect__no-results" style={dropdownStyle}>
        {showSearchHint ? searchHint : 'No results'}
      </div>
    )
  ) : null;

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      {label && <span className="multiselect__label">{label}</span>}

      <div
        className={`multiselect__trigger ${isOpen ? 'multiselect__trigger--open' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(val => {
          const opt = options.find(o => o.value === val);
          if (!opt) return null;
          return (
            <Tag key={val} onClick={onTagClick ? () => onTagClick(val) : undefined} onClose={disabled ? undefined : () => removeValue(val)}>
              {opt.label}
            </Tag>
          );
        })}

        <input
          ref={inputRef}
          name={name}
          type="text"
          className="multiselect__input"
          value={inputValue}
          onChange={handleInputChangeEvent}
          onFocus={open}
          onKeyDown={handleInputKeyDown}
          placeholder={value.length === 0 ? placeholder : undefined}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
        />
      </div>

      {dropdown && createPortal(dropdown, portalTarget ?? document.body)}

      {description && <span className="multiselect__description text-secondary">{description}</span>}
      {errorMessage && <span className="multiselect__error-message">{errorMessage}</span>}
    </div>
  );
}
