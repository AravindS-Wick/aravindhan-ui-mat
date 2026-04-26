import { forwardRef, useState } from 'react';
import { cls, type Size } from './types';
import type { TextFieldProps } from './TextField';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type' | 'endAdornment'> {
  /** Show strength meter. */
  showStrength?: boolean;
  /** Custom show/hide toggle icons. */
  showIcon?: React.ReactNode;
  hideIcon?: React.ReactNode;
}

function getStrength(password: string): { level: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const level = Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { level, label: labels[level] };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showStrength = false, showIcon, hideIcon, value, defaultValue, className = '', label, helperText, error, size, fullWidth, required, onChange, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [localValue, setLocalValue] = useState(String(defaultValue ?? ''));

  const currentValue = String(value ?? localValue);
  const strength = showStrength ? getStrength(currentValue) : null;

  const toggle = (
    <button
      type="button"
      className="av-password-toggle"
      aria-label={visible ? 'Hide password' : 'Show password'}
      onClick={() => setVisible((v) => !v)}
      tabIndex={-1}
    >
      {visible ? (hideIcon ?? '🙈') : (showIcon ?? '👁️')}
    </button>
  );

  return (
    <div className={cls('av-password-field', className)}>
      <div className={cls('av-text-field', fullWidth && 'av-text-field-full', error && 'av-text-field-error')}>
        {label && (
          <label className="av-form-label">
            {label}
            {required && <span className="av-form-required" aria-hidden="true"> *</span>}
          </label>
        )}
        <div className="av-input-wrapper av-input-wrapper-end">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={cls('av-input', size && size !== 'md' && `av-input-${size}`, error && 'av-input-error')}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              onChange?.(e);
            }}
            aria-invalid={Boolean(error) || undefined}
            required={required}
            {...props}
          />
          <span className="av-input-adornment av-input-adornment-end">{toggle}</span>
        </div>
        {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
        {!error && helperText && <p className="av-form-helper">{helperText}</p>}
      </div>
      {showStrength && currentValue && strength && (
        <div className="av-password-strength" aria-live="polite">
          <div className="av-password-strength-bars">
            {[1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className={cls(
                  'av-password-strength-bar',
                  lvl <= strength.level && `av-password-strength-${strength.level <= 1 ? 'weak' : strength.level <= 2 ? 'fair' : strength.level === 3 ? 'good' : 'strong'}`,
                )}
              />
            ))}
          </div>
          {strength.label && <span className="av-password-strength-label">{strength.label}</span>}
        </div>
      )}
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

import React from 'react';
