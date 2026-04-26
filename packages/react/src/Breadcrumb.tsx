import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface BreadcrumbItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether this is the current/active page. */
  active?: boolean;
  /** Icon rendered before label. */
  icon?: ReactNode;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Custom separator. Defaults to CSS `>`. */
  separator?: ReactNode;
  /** ARIA label for the nav element. */
  ariaLabel?: string;
}

export function BreadcrumbItem({
  active = false,
  icon,
  className = '',
  children,
  ...props
}: BreadcrumbItemProps) {
  if (active) {
    return (
      <li className={cls('av-breadcrumb-item', 'av-breadcrumb-item-active', className)} aria-current="page">
        {icon && <span className="av-breadcrumb-icon">{icon}</span>}
        {children}
      </li>
    );
  }
  return (
    <li className={cls('av-breadcrumb-item', className)}>
      <a {...props}>
        {icon && <span className="av-breadcrumb-icon">{icon}</span>}
        {children}
      </a>
    </li>
  );
}

export function Breadcrumb({
  separator,
  ariaLabel = 'Breadcrumb',
  className = '',
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} {...props}>
      <ol
        className={cls('av-breadcrumb', className)}
        data-av-separator={typeof separator === 'string' ? separator : undefined}
      >
        {children}
      </ol>
    </nav>
  );
}
