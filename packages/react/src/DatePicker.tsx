import { forwardRef, type InputHTMLAttributes } from 'react';
import { cls, type Size } from './types';

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

export interface DatePickerProps extends BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
  /** Show calendar icon button. Defaults to true. */
  showIcon?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { label, helperText, error, size, fullWidth, showIcon = true, className = '', id, required, disabled, ...props },
  ref,
) {
  const inputId = id ?? (label ? `av-dp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const helperId = helperText || error ? `${inputId}-helper` : undefined;

  return (
    <div className={cls('av-text-field', fullWidth && 'av-text-field-full', error && 'av-text-field-error', className)}>
      {label && (
        <label className="av-form-label" htmlFor={inputId}>
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="date"
        className={cls('av-input', size && size !== 'md' && `av-input-${size}`, error && 'av-input-error')}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={helperId}
        {...props}
      />
      {error && <p id={helperId} className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p id={helperId} className="av-form-helper">{helperText}</p>}
    </div>
  );
});
DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  startValue?: string;
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  min?: string;
  max?: string;
  error?: string;
  helperText?: string;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function DateRangePicker({
  label,
  startLabel = 'Start date',
  endLabel = 'End date',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  min,
  max,
  error,
  helperText,
  size,
  fullWidth,
  disabled,
  required,
  className = '',
}: DateRangePickerProps) {
  return (
    <div className={cls('av-date-range', fullWidth && 'av-date-range-full', error && 'av-text-field-error', className)}>
      {label && <span className="av-form-label">{label}</span>}
      <div className="av-date-range-inputs">
        <DatePicker
          label={startLabel}
          value={startValue}
          onChange={(e) => onStartChange?.(e.target.value)}
          min={min}
          max={endValue ?? max}
          size={size}
          disabled={disabled}
          required={required}
          fullWidth={fullWidth}
        />
        <span className="av-date-range-sep" aria-hidden="true">—</span>
        <DatePicker
          label={endLabel}
          value={endValue}
          onChange={(e) => onEndChange?.(e.target.value)}
          min={startValue ?? min}
          max={max}
          size={size}
          disabled={disabled}
          required={required}
          fullWidth={fullWidth}
        />
      </div>
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p className="av-form-helper">{helperText}</p>}
    </div>
  );
}

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { label, helperText, error, size, fullWidth, className = '', id, required, disabled, ...props },
  ref,
) {
  const inputId = id ?? (label ? `av-tp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className={cls('av-text-field', fullWidth && 'av-text-field-full', error && 'av-text-field-error', className)}>
      {label && (
        <label className="av-form-label" htmlFor={inputId}>
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="time"
        className={cls('av-input', size && size !== 'md' && `av-input-${size}`, error && 'av-input-error')}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p className="av-form-helper">{helperText}</p>}
    </div>
  );
});
TimePicker.displayName = 'TimePicker';

export interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker(
  { label, helperText, error, size, fullWidth, className = '', id, required, disabled, ...props },
  ref,
) {
  const inputId = id ?? (label ? `av-dtp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className={cls('av-text-field', fullWidth && 'av-text-field-full', error && 'av-text-field-error', className)}>
      {label && (
        <label className="av-form-label" htmlFor={inputId}>
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="datetime-local"
        className={cls('av-input', size && size !== 'md' && `av-input-${size}`, error && 'av-input-error')}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p className="av-form-helper">{helperText}</p>}
    </div>
  );
});
DateTimePicker.displayName = 'DateTimePicker';
