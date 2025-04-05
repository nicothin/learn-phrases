import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import './Select.css';

import { SelectOption } from '../../types';

interface SelectFormProps {
  name: string;
  label?: string;
  description?: string | ReactNode;
  options: SelectOption[];
  initialValue?: SelectOption['value'];
  className?: string;
  onChange?: (value: SelectOption['value']) => void;
  children?: ReactNode;
}

export const Select = ({
  name,
  label,
  description,
  options = [],
  initialValue = '',
  className,
  onChange,
}: SelectFormProps) => {
  const [value, setValue] = useState<SelectOption['value']>(initialValue);

  const onChangeCheched = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);

    if (typeof onChange === 'function') {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    if (initialValue === undefined) {
      return;
    }

    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={`select ${className ?? ''}`}>
      <label className="select__label">
        {label && <span className="select__label-text">{label}</span>}
        <select name={name} className="select__select" onChange={onChangeCheched} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {description && <div className="select__description  text-secondary">{description}</div>}
    </div>
  );
};
