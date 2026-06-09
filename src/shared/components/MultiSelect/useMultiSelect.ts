import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDropdownPosition } from './useDropdownPosition';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface UseMultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  initialInputValue?: string;
  searchThreshold?: number;
  debounceMs?: number;
  fallbackOptions?: MultiSelectOption[];
}

export function useMultiSelect({
  options,
  value,
  onChange,
  disabled,
  initialInputValue = '',
  searchThreshold = 0,
  debounceMs = 0,
  fallbackOptions,
}: UseMultiSelectProps) {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [debouncedInput, setDebouncedInput] = useState(initialInputValue);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (debounceMs <= 0) return;

    const timer = setTimeout(() => setDebouncedInput(inputValue), debounceMs);
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  const effectiveSearchValue = debounceMs <= 0 ? inputValue : debouncedInput;

  const filteredOptions = useMemo(() => {
    if (inputValue.length < searchThreshold) {
      return fallbackOptions ?? [];
    }

    const lower = effectiveSearchValue.toLowerCase();
    return options.filter(o => !value.includes(o.value) && o.label.toLowerCase().includes(lower));
  }, [options, value, effectiveSearchValue, inputValue, searchThreshold, fallbackOptions]);

  const { style: dropdownStyle, isPositioned } = useDropdownPosition(wrapperRef, isOpen);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const open = useCallback(() => {
    if (disabled) return;

    setIsOpen(true);

    if (highlightedIndex === -1 && filteredOptions.length > 0) {
      setHighlightedIndex(0);
    }
  }, [disabled, highlightedIndex, filteredOptions.length]);

  const addValue = useCallback(
    (val: string) => {
      if (!value.includes(val)) {
        onChange([...value, val]);
      }
      setInputValue('');
      setHighlightedIndex(0);
      inputRef.current?.focus();
    },
    [value, onChange],
  );

  const removeValue = useCallback(
    (val: string) => {
      onChange(value.filter(v => v !== val));
      inputRef.current?.focus();
    },
    [value, onChange],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (!isOpen) open();
      setHighlightedIndex(0);
    },
    [isOpen, open],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          addValue(filteredOptions[highlightedIndex].value);
        }
      } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        removeValue(value[value.length - 1]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    },
    [isOpen, open, close, filteredOptions, highlightedIndex, addValue, removeValue, inputValue, value],
  );

  return {
    inputValue,
    setInputValue,
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
  };
}
