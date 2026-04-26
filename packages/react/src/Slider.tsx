import { forwardRef, type InputHTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  min?: number;
  max?: number;
  step?: number;
  /** Show current value as tooltip on the thumb. */
  showTooltip?: boolean;
  color?: ColorScheme;
  size?: Size;
  label?: string;
  /** Show min/max tick marks. */
  marks?: boolean;
  /** Error state. */
  error?: boolean;
  helperText?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    showTooltip = false,
    color = 'primary',
    size = 'md',
    label,
    marks = false,
    error = false,
    helperText,
    className = '',
    id,
    ...props
  },
  ref,
) {
  return (
    <div className={cls('av-slider-wrapper', size !== 'md' && `av-slider-${size}`, error && 'av-slider-error', className)}>
      {label && <label htmlFor={id} className="av-form-label">{label}</label>}
      <div className="av-slider-track-wrapper">
        <input
          ref={ref}
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          className={cls('av-slider', `av-slider-${color}`, showTooltip && 'av-slider-tooltip')}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={error || undefined}
          {...props}
        />
        {marks && (
          <div className="av-slider-marks" aria-hidden="true">
            <span className="av-slider-mark-label">{min}</span>
            <span className="av-slider-mark-label">{max}</span>
          </div>
        )}
      </div>
      {helperText && (
        <p className={cls('av-form-helper', error && 'av-form-helper-error')}>{helperText}</p>
      )}
    </div>
  );
});
Slider.displayName = 'Slider';
