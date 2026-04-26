import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text. */
  label?: string;
  /** Indeterminate state (visually shows dash). */
  indeterminate?: boolean;
  /** Color when checked. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Error state. */
  error?: boolean;
  /** Helper text below label. */
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    indeterminate = false,
    color = 'primary',
    size = 'md',
    error = false,
    helperText,
    className = '',
    id,
    disabled,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? innerRef;

  useEffect(() => {
    if (resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, resolvedRef]);

  return (
    <div className={cls('av-checkbox-field', error && 'av-checkbox-field-error', className)}>
      <label
        htmlFor={id}
        className={cls(
          'av-checkbox-wrapper',
          size !== 'md' && `av-checkbox-${size}`,
          disabled && 'av-checkbox-disabled',
        )}
      >
        <input
          ref={resolvedRef}
          type="checkbox"
          id={id}
          className={cls('av-checkbox', `av-checkbox-${color}`, error && 'av-checkbox-error')}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-invalid={error || undefined}
          disabled={disabled}
          {...props}
        />
        {label && <span className="av-checkbox-label">{label}</span>}
      </label>
      {helperText && (
        <p className={cls('av-form-helper', error && 'av-form-helper-error')}>{helperText}</p>
      )}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

import type React from 'react';
