import { forwardRef, type InputHTMLAttributes, type HTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text. */
  label?: string;
  /** Color variant. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Error state. */
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, color = 'primary', size = 'md', error = false, className = '', id, disabled, ...props },
  ref,
) {
  return (
    <label
      htmlFor={id}
      className={cls(
        'av-radio-wrapper',
        size !== 'md' && `av-radio-${size}`,
        error && 'av-radio-error',
        disabled && 'av-radio-disabled',
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        id={id}
        className={cls('av-radio', `av-radio-${color}`)}
        aria-invalid={error || undefined}
        disabled={disabled}
        {...props}
      />
      {label && <span className="av-radio-label">{label}</span>}
    </label>
  );
});
Radio.displayName = 'Radio';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  legend?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  direction?: 'horizontal' | 'vertical';
  color?: ColorScheme;
  size?: Size;
  error?: string;
  required?: boolean;
}

export function RadioGroup({
  legend,
  options,
  value,
  defaultValue,
  onChange,
  name,
  direction = 'vertical',
  color = 'primary',
  size = 'md',
  error,
  required,
  className = '',
  ...props
}: RadioGroupProps) {
  return (
    <fieldset
      className={cls('av-radio-group', `av-radio-group-${direction}`, error && 'av-radio-group-error', className)}
      aria-required={required}
      {...props}
    >
      {legend && (
        <legend className="av-radio-group-legend">
          {legend}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </legend>
      )}
      {options.map((opt) => (
        <div key={opt.value} className="av-radio-option">
          <Radio
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            label={opt.label}
            disabled={opt.disabled}
            color={color}
            size={size}
            error={Boolean(error)}
            checked={value !== undefined ? value === opt.value : undefined}
            defaultChecked={defaultValue !== undefined ? defaultValue === opt.value : undefined}
            onChange={() => onChange?.(opt.value)}
          />
          {opt.helperText && (
            <p className="av-radio-helper">{opt.helperText}</p>
          )}
        </div>
      ))}
      {error && (
        <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>
      )}
    </fieldset>
  );
}
