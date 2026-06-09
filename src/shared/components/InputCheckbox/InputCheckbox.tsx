import { type ChangeEvent, type ReactNode, useState } from 'react';

import './InputCheckbox.css';

interface InputCheckboxProps {
  name: string;
  description?: string | ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  className?: string;
  onChange?: (value: boolean) => void;
  children?: ReactNode;
}

export const InputCheckbox = ({
  name,
  description,
  checked: controlledChecked,
  defaultChecked = false,
  className,
  onChange,
  children,
}: InputCheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    if (!isControlled) {
      setInternalChecked(checked);
    }

    onChange?.(checked);
  };

  return (
    <div className={`input-checkbox ${className ?? ''}`}>
      <label className="input-checkbox__label">
        <input
          className="input-checkbox__input"
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        {children && (
          <>
            {' '}
            <span className="input-checkbox__content">{children}</span>
          </>
        )}
      </label>
      {description && <div className="input-checkbox__description  text-secondary">{description}</div>}
    </div>
  );
};
