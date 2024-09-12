import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import './InputCheckbox.css';

interface CheckboxFormProps {
  name: string;
  description?: string | ReactNode;
  initialChecked?: boolean;
  className?: string;
  onChange?: (value: boolean) => void;
  children?: ReactNode;
}

export const InputCheckbox = ({
  name,
  description,
  initialChecked,
  className,
  onChange,
  children,
}: CheckboxFormProps) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const onChangeCheched = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);

    if (typeof onChange === 'function') {
      onChange(e.target.checked);
    }
  };

  useEffect(() => {
    if (initialChecked === undefined) {
      return;
    }

    setIsChecked(initialChecked);
  }, [initialChecked]);

  return (
    <div className={`input-checkbox ${className ?? ''}`}>
      <label className="input-checkbox__label">
        <input
          className="input-checkbox__input"
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={onChangeCheched}
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
