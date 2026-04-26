import { forwardRef, useRef, useState, useId, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange' | 'value' | 'defaultValue'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
  /** Step amount. Defaults to 1. */
  step?: number;
  min?: number;
  max?: number;
  /** Decimal precision. */
  precision?: number;
  /** Called with the numeric value (or null if empty). */
  onChange?: (value: number | null) => void;
  /** Controlled numeric value. */
  value?: number | null;
  defaultValue?: number;
  /** Show increment/decrement buttons. */
  stepper?: boolean;
  /** Show +/- prefix buttons. */
  controls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    label,
    helperText,
    error,
    size = 'md',
    fullWidth = false,
    required = false,
    step = 1,
    min,
    max,
    precision,
    onChange,
    value: controlledValue,
    defaultValue,
    stepper = true,
    controls = false,
    className = '',
    id,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  const [internal, setInternal] = useState<string>(
    controlledValue != null ? String(controlledValue) :
    defaultValue != null ? String(defaultValue) : '',
  );

  const display = controlledValue != null ? String(controlledValue) : internal;

  function clamp(v: number) {
    if (min != null && v < min) return min;
    if (max != null && v > max) return max;
    return v;
  }

  function format(v: number) {
    return precision != null ? Number(v.toFixed(precision)) : v;
  }

  function increment() {
    const current = parseFloat(display) || 0;
    const next = format(clamp(current + step));
    setInternal(String(next));
    onChange?.(next);
  }

  function decrement() {
    const current = parseFloat(display) || 0;
    const next = format(clamp(current - step));
    setInternal(String(next));
    onChange?.(next);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInternal(raw);
    const parsed = raw === '' ? null : parseFloat(raw);
    if (parsed === null || !isNaN(parsed)) {
      onChange?.(parsed != null ? format(clamp(parsed)) : null);
    }
  }

  return (
    <div className={cls('av-number-input', fullWidth && 'av-number-input-full', hasError && 'av-number-input-error', className)}>
      {label && (
        <label htmlFor={inputId} className="av-form-label">
          {label}{required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={cls('av-number-input-control', size !== 'md' && `av-number-input-${size}`)}>
        {controls && (
          <button type="button" className="av-number-input-btn" onClick={decrement} disabled={disabled || (min != null && parseFloat(display) <= min)} aria-label="Decrease">−</button>
        )}
        <input
          ref={ref}
          id={inputId}
          type="number"
          className={cls('av-input', 'av-number-input-field', size !== 'md' && `av-input-${size}`, hasError && 'av-input-error')}
          value={display}
          step={step}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          onChange={handleChange}
          {...props}
        />
        {controls && (
          <button type="button" className="av-number-input-btn" onClick={increment} disabled={disabled || (max != null && parseFloat(display) >= max)} aria-label="Increase">+</button>
        )}
        {stepper && !controls && (
          <div className="av-number-input-stepper">
            <button type="button" className="av-number-input-step-up" onClick={increment} disabled={disabled || (max != null && parseFloat(display) >= max)} aria-label="Increase" tabIndex={-1}>▲</button>
            <button type="button" className="av-number-input-step-down" onClick={decrement} disabled={disabled || (min != null && parseFloat(display) <= min)} aria-label="Decrease" tabIndex={-1}>▼</button>
          </div>
        )}
      </div>
      {hasError ? (
        <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>
      ) : helperText ? (
        <p className="av-form-helper">{helperText}</p>
      ) : null}
    </div>
  );
});
NumberInput.displayName = 'NumberInput';

