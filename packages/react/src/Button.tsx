import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cls, type Variant, type Size } from './types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual appearance. Defaults to 'solid'. */
  appearance?: 'solid' | 'outline' | 'ghost' | 'link';
  /** Semantic color theme. Defaults to 'primary'. */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Shows a spinner and disables the button when true. */
  loading?: boolean;
  /** Makes the button full-width. */
  block?: boolean;
  /** Icon rendered before children. */
  startIcon?: ReactNode;
  /** Icon rendered after children. */
  endIcon?: ReactNode;
  /** If true, renders as child element (e.g. with Radix Slot or custom logic). Currently an escape hatch. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance = 'solid',
    color = 'primary',
    size = 'md',
    loading = false,
    block = false,
    className = '',
    children,
    startIcon,
    endIcon,
    disabled,
    type = 'button',
    asChild,
    ...props
  },
  ref,
) {
  // If asChild is provided but we don't have Radix Slot yet, we'll just fall back to standard button.
  // A future improvement would import Slot from @radix-ui/react-slot and render that.
  return (
    <button
      ref={ref}
      type={type}
      className={cls(
        'av-btn',
        `av-btn-${appearance}-${color}`,
        size !== 'md' && `av-btn-${size}`,
        loading && 'av-btn-loading',
        block && 'av-btn-block',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span className="av-spinner av-spinner-border av-spinner-sm" role="status" aria-hidden="true" />
      )}
      {startIcon && <span className="av-btn-icon av-btn-icon-start" aria-hidden="true">{startIcon}</span>}
      {children}
      {endIcon && <span className="av-btn-icon av-btn-icon-end" aria-hidden="true">{endIcon}</span>}
    </button>
  );
});
Button.displayName = 'Button';
