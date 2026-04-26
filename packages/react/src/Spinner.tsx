import type { HTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant. Defaults to `'border'`. */
  variant?: 'border' | 'dots' | 'grow';
  /** Color. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Accessible label. Defaults to `'Loading…'`. */
  label?: string;
}

export function Spinner({
  variant = 'border',
  color = 'primary',
  size = 'md',
  label = 'Loading…',
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <span
      className={cls(
        'av-spinner',
        `av-spinner-${variant}`,
        `av-spinner-${color}`,
        size !== 'md' && `av-spinner-${size}`,
        className,
      )}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="av-sr-only">{label}</span>
    </span>
  );
}
