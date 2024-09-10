import { ChangeEvent, ReactNode, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

import './InputText.css';

interface TextFormProps {
  name: string;
  size?: 'lg';
  label?: string;
  description?: string | ReactNode;
  value?: string;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  errorMessage?: string | ReactNode;
  required?: boolean;
  checkValidity?: boolean;
  isStandart?: boolean;
  onChange?: (value: string) => void;
}

export type InputTextHandle = {
  focus: () => void;
};

export const InputText = forwardRef<InputTextHandle, TextFormProps>(
  (
    {
      name,
      size,
      label,
      description,
      value,
      initialValue,
      placeholder,
      className,
      errorMessage,
      required,
      checkValidity,
      isStandart,
      onChange,
    },
    ref,
  ) => {
    const [textareaValue, setTextareaValue] = useState(value ?? initialValue ?? '');
    const [isValid, setIsValid] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setTextareaValue(value);

      if (typeof onChange === 'function') {
        onChange(value);
      }
    };

    useEffect(() => {
      if (!value) {
        return;
      }

      setTextareaValue(value);
    }, [value]);

    useEffect(() => {
      if (!textareaRef.current || isStandart) return;

      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;

      setIsValid(checkValidity ? textareaRef.current.checkValidity() : true);
    }, [checkValidity, isStandart, textareaValue]);

    return (
      <div
        className={`input-text ${className ?? ''} ${!isValid ? 'input-text--error' : ''} ${size ? `input-text--size-${size}` : ''}`}
      >
        <label className="input-text__label">
          {label && <span className="input-text__label-text">{label}</span>}
          <textarea
            ref={textareaRef}
            name={name}
            rows={1}
            value={textareaValue}
            onChange={onTextareaChange}
            required={required}
            className={`input-text__input ${isStandart ? 'input-text__input--standart' : ''}`}
            placeholder={placeholder}
          />
        </label>
        {description && <span className="input-text__description text-secondary">{description}</span>}
        {!isValid && errorMessage && <span className="input-text__error-message">{errorMessage}</span>}
      </div>
    );
  },
);
