import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cls, type Size } from './types';
import { useFieldProps } from './FormProvider';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  /** Error message — also sets aria-invalid. */
  error?: string;
  success?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  size?: Size;
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  rawProps,
  ref,
) {
  const {
    label,
    helperText,
    error,
    success = false,
    startAdornment,
    endAdornment,
    size = 'md',
    fullWidth = false,
    required = false,
    className = '',
    id,
    ...props
  } = useFieldProps(rawProps);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div
      className={cls(
        'av-text-field',
        fullWidth && 'av-text-field-full',
        hasError && 'av-text-field-error',
        success && 'av-text-field-success',
        className,
      )}
    >
      {label && (
        <label htmlFor={inputId} className="av-form-label">
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        className={cls(
          'av-input-wrapper',
          Boolean(startAdornment) && 'av-input-wrapper-start',
          Boolean(endAdornment) && 'av-input-wrapper-end',
        )}
      >
        {startAdornment && (
          <span className="av-input-adornment av-input-adornment-start" aria-hidden="true">
            {startAdornment}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cls(
            'av-input',
            size !== 'md' && `av-input-${size}`,
            hasError && 'av-input-error',
            success && 'av-input-success',
          )}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          aria-invalid={hasError || undefined}
          required={required}
          {...props}
        />
        {endAdornment && (
          <span className="av-input-adornment av-input-adornment-end" aria-hidden="true">
            {endAdornment}
          </span>
        )}
      </div>
      {hasError && (
        <p id={`${inputId}-error`} className="av-form-helper av-form-helper-error" role="alert">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${inputId}-helper`} className="av-form-helper">{helperText}</p>
      )}
    </div>
  );
});
TextField.displayName = 'TextField';
