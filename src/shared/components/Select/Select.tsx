import { type ChangeEvent, type ReactNode, useState } from 'react';

import './Select.css';

export interface SelectOption {
  value: string;
  label: string | ReactNode;
}

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

  if (options.length === 0) return null;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const selectClasses = ['select', className].filter(Boolean).join(' ');

  return (
    <div className={selectClasses}>
      <label className="select__label">
        {label && <span className="select__label-text">{label}</span>}
        <select name={name} className="select__select" onChange={handleChange} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {description && <div className="select__description text-secondary">{description}</div>}
    </div>
  );
};
