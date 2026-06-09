import { type ChangeEvent, type ReactNode, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

import './InputText.css';

interface InputTextProps {
  name: string;
  size?: 'lg';
  label?: string;
  description?: string | ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  errorMessage?: string | ReactNode;
  required?: boolean;
  checkValidity?: boolean;
  standard?: boolean;
  onChange?: (value: string) => void;
  maxLength?: number;
}

export type InputTextHandle = {
  focus: () => void;
};

const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight + 2}px`;
};

export const InputText = forwardRef<InputTextHandle, InputTextProps>(
  (
    {
      name,
      size,
      label,
      description,
      value: controlledValue,
      defaultValue = '',
      placeholder,
      className,
      errorMessage,
      required,
      checkValidity,
      standard,
      onChange,
      maxLength,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isValid, setIsValid] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    const handleChange = (events: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = events.target.value;

      if (maxLength && newValue.length > maxLength) {
        return;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    useEffect(() => {
      const element = textareaRef.current;
      if (!element || standard) return;

      adjustTextareaHeight(element);
      setIsValid(checkValidity ? element.checkValidity() : true);
    }, [checkValidity, standard, value]);

    return (
      <div
        className={`input-text ${className ?? ''} ${!isValid ? 'input-text--error' : ''} ${size ? `input-text--size-${size}` : ''} ${maxLength ? 'input-text--has-max-length' : ''}`}
      >
        <label className="input-text__label">
          {label && <span className="input-text__label-text">{label}</span>}
          <textarea
            ref={textareaRef}
            name={name}
            rows={1}
            value={value}
            onChange={handleChange}
            required={required}
            className={`input-text__input ${standard ? 'input-text__input--standart' : ''}`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        </label>

        {description && <span className="input-text__description text-secondary">{description}</span>}

        {!isValid && errorMessage && <span className="input-text__error-message">{errorMessage}</span>}

        {maxLength && (
          <span className="input-text__character-count  text-secondary">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);
