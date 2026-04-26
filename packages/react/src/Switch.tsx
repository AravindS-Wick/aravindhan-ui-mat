import { forwardRef, type InputHTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  /** Color variant when checked. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  labelPlacement?: 'left' | 'right';
  /** Error state. */
  error?: boolean;
  /** Helper text. */
  helperText?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    color = 'primary',
    size = 'md',
    labelPlacement = 'right',
    error = false,
    helperText,
    className = '',
    id,
    disabled,
    ...props
  },
  ref,
) {
  const switchEl = (
    <label
      className={cls(
        'av-switch',
        `av-switch-${color}`,
        size !== 'md' && `av-switch-${size}`,
        error && 'av-switch-error',
        disabled && 'av-switch-disabled',
      )}
      htmlFor={id}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={id}
        className="av-switch-input"
        aria-invalid={error || undefined}
        disabled={disabled}
        {...props}
      />
      <span className="av-switch-track" aria-hidden="true">
        <span className="av-switch-thumb" />
      </span>
    </label>
  );

  return (
    <div className={cls('av-switch-field', error && 'av-switch-field-error', className)}>
      <div className={cls('av-switch-wrapper', `av-switch-label-${labelPlacement}`)}>
        {label && labelPlacement === 'left' && (
          <span className={cls('av-switch-label-text', disabled && 'av-switch-label-disabled')}>{label}</span>
        )}
        {switchEl}
        {label && labelPlacement === 'right' && (
          <span className={cls('av-switch-label-text', disabled && 'av-switch-label-disabled')}>{label}</span>
        )}
      </div>
      {helperText && (
        <p className={cls('av-form-helper', error && 'av-form-helper-error')}>{helperText}</p>
      )}
    </div>
  );
});
Switch.displayName = 'Switch';
