import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cls, type Variant, type Size } from './types';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Accessible label (required). */
  'aria-label': string;
  /** Icon content. */
  children: ReactNode;
  /** Visual appearance. Defaults to 'ghost'. */
  appearance?: 'solid' | 'outline' | 'ghost' | 'link';
  /** Semantic color theme. Defaults to 'secondary'. */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Show loading spinner. */
  loading?: boolean;
  /** Rounded circle shape. */
  rounded?: boolean;
}

export function IconButton({
  appearance = 'ghost',
  color = 'secondary',
  size = 'md',
  loading = false,
  rounded = false,
  className = '',
  disabled,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cls(
        'av-btn',
        'av-btn-icon',
        `av-btn-${appearance}-${color}`,
        size !== 'md' && `av-btn-${size}`,
        rounded && 'av-rounded-full',
        loading && 'av-btn-loading',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="av-spinner av-spinner-border av-spinner-sm" role="status" aria-hidden="true" /> : children}
    </button>
  );
}
