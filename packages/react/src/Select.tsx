import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cls, type Size } from './types';
import { useFieldProps } from './FormProvider';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  /** Error message. */
  error?: string;
  success?: boolean;
  size?: Size;
  fullWidth?: boolean;
  /** Flat options array. */
  options?: SelectOption[];
  /** Grouped options. */
  groups?: SelectGroup[];
  /** Placeholder option (value = ''). */
  placeholder?: string;
  /** Leading icon/adornment. */
  startAdornment?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  rawProps,
  ref,
) {
  const {
    label,
    helperText,
    error,
    success = false,
    size = 'md',
    fullWidth = false,
    required = false,
    options,
    groups,
    placeholder,
    startAdornment,
    className = '',
    id,
    children,
    ...props
  } = useFieldProps(rawProps);
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className={cls('av-select-field', fullWidth && 'av-select-field-full', hasError && 'av-select-field-error', success && 'av-select-field-success', className)}>
      {label && (
        <label htmlFor={selectId} className="av-form-label">
          {label}{required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={cls('av-select-wrapper', Boolean(startAdornment) && 'av-select-wrapper-start')}>
        {startAdornment && (
          <span className="av-input-adornment av-input-adornment-start" aria-hidden="true">{startAdornment}</span>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cls('av-select', size !== 'md' && `av-select-${size}`, hasError && 'av-select-error', success && 'av-select-success')}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          required={required}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {groups?.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
          {children}
        </select>
        <span className="av-select-arrow" aria-hidden="true" />
      </div>
      {hasError ? (
        <p id={`${selectId}-error`} className="av-form-helper av-form-helper-error" role="alert">{error}</p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="av-form-helper">{helperText}</p>
      ) : null}
    </div>
  );
});
Select.displayName = 'Select';
