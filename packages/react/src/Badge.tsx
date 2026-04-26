import type { HTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant. Defaults to `'primary'`. */
  variant?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Renders the badge as a pill (fully rounded). */
  pill?: boolean;
  /** Renders the badge as an outlined style. */
  outline?: boolean;
}

export function Badge({
  variant = 'primary',
  size = 'md',
  pill = false,
  outline = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const computed = cls(
    'av-badge',
    `av-badge-${variant}`,
    size !== 'md' && `av-badge-${size}`,
    pill && 'av-badge-pill',
    outline && 'av-badge-outline',
    className,
  );

  return (
    <span className={computed} {...props}>
      {children}
    </span>
  );
}
