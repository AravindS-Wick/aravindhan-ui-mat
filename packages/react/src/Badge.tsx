import type { HTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The semantic color tint of the badge. Defaults to `'primary'`. */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** The visual appearance of the badge. Defaults to `'soft'`. */
  appearance?: 'soft' | 'solid' | 'outline';
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Shape of the badge. Defaults to `'pill'`. */
  shape?: 'rounded' | 'pill';
}

export function Badge({
  color = 'primary',
  appearance = 'soft',
  size = 'md',
  shape = 'pill',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const computed = cls(
    'av-badge',
    `av-badge-appearance-${appearance}`,
    `av-badge-color-${color}`,
    `av-badge-size-${size}`,
    `av-badge-shape-${shape}`,
    className,
  );

  return (
    <span className={computed} {...props}>
      {children}
    </span>
  );
}
