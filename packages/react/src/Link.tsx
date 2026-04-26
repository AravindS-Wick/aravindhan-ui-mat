import type { AnchorHTMLAttributes } from 'react';
import { cls } from './types';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Underline behavior. Defaults to `'hover'`. */
  underline?: 'always' | 'hover' | 'none';
  /** Color variant. */
  color?: 'primary' | 'secondary' | 'muted' | 'danger' | 'inherit';
  /** Open in new tab (sets target + rel automatically). */
  external?: boolean;
}

export function Link({
  underline = 'hover',
  color = 'primary',
  external = false,
  className = '',
  children,
  ...props
}: LinkProps) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      className={cls(
        'av-link',
        `av-link-${color}`,
        underline !== 'hover' && `av-link-underline-${underline}`,
        className,
      )}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
}
