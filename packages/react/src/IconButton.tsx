import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cls, type Variant, type Size } from './types';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label (required). */
  'aria-label': string;
  /** Icon content. */
  children: ReactNode;
  /** Visual variant. Defaults to `'ghost'`. */
  variant?: Variant;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Show loading spinner. */
  loading?: boolean;
  /** Rounded circle shape. */
  rounded?: boolean;
}

export function IconButton({
  variant = 'ghost',
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
        'av-icon-btn',
        `av-icon-btn-${variant}`,
        size !== 'md' && `av-icon-btn-${size}`,
        rounded && 'av-icon-btn-rounded',
        loading && 'av-icon-btn-loading',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="av-spinner av-spinner-border av-spinner-sm" role="status" aria-hidden="true" /> : children}
    </button>
  );
}
