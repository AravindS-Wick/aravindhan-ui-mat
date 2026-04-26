import { useState, type HTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value (1–max). */
  value?: number;
  /** Default value (uncontrolled). */
  defaultValue?: number;
  /** Max stars. Defaults to 5. */
  max?: number;
  /** Called when value changes. */
  onChange?: (value: number) => void;
  /** Read-only display. */
  readOnly?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Custom icon (filled). */
  filledIcon?: string;
  /** Custom icon (empty). */
  emptyIcon?: string;
  /** Accessible label. */
  label?: string;
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  onChange,
  readOnly = false,
  disabled = false,
  size = 'md',
  filledIcon = '★',
  emptyIcon = '☆',
  label = 'Rating',
  className = '',
  ...props
}: RatingProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [hovered, setHovered] = useState(0);
  const current = controlledValue ?? internal;
  const display = hovered || current;

  function handleClick(v: number) {
    if (readOnly || disabled) return;
    setInternal(v);
    onChange?.(v);
  }

  return (
    <div
      className={cls(
        'av-rating',
        size !== 'md' && `av-rating-${size}`,
        readOnly && 'av-rating-readonly',
        disabled && 'av-rating-disabled',
        className,
      )}
      role="radiogroup"
      aria-label={label}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const v = i + 1;
        const filled = v <= display;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={v === current}
            aria-label={`${v} star${v !== 1 ? 's' : ''}`}
            className={cls('av-rating-star', filled && 'av-rating-star-filled')}
            onClick={() => handleClick(v)}
            onMouseEnter={() => !readOnly && !disabled && setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            disabled={disabled}
            tabIndex={disabled || readOnly ? -1 : 0}
          >
            {filled ? filledIcon : emptyIcon}
          </button>
        );
      })}
    </div>
  );
}
