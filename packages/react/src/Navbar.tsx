import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Brand content (logo + name). */
  brand?: ReactNode;
  /** Sticky behavior. */
  sticky?: 'top' | 'bottom';
  /** Makes the navbar transparent. */
  transparent?: boolean;
  /** Theme variant. */
  variant?: 'light' | 'dark';
  /** Container fluid. */
  fluid?: boolean;
}

export function Navbar({
  brand,
  sticky,
  transparent,
  variant = 'light',
  fluid = false,
  className = '',
  children,
  ...props
}: NavbarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className={cls(
        'av-navbar',
        `av-navbar-${variant}`,
        sticky && `av-navbar-sticky-${sticky}`,
        transparent && 'av-navbar-transparent',
        className,
      )}
      {...props}
    >
      <div className={cls(fluid ? 'av-container-fluid' : 'av-container', 'av-navbar-container')}>
        {brand && <div className="av-navbar-brand">{brand}</div>}
        <button
          type="button"
          className={cls('av-navbar-toggler', expanded && 'av-navbar-toggler-open')}
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="av-navbar-toggler-icon" />
        </button>
        <div className={cls('av-navbar-collapse', expanded && 'av-navbar-collapse-open')}>
          {children}
        </div>
      </div>
    </nav>
  );
}

export interface NavbarNavProps extends HTMLAttributes<HTMLUListElement> {}
export function NavbarNav({ className = '', children, ...props }: NavbarNavProps) {
  return <ul className={cls('av-navbar-nav', className)} {...props}>{children}</ul>;
}

export interface NavItemProps extends HTMLAttributes<HTMLLIElement> {
  active?: boolean;
}
export function NavItem({ active, className = '', children, ...props }: NavItemProps) {
  return (
    <li className={cls('av-nav-item', active && 'av-nav-item-active', className)} {...props}>
      {children}
    </li>
  );
}

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  disabled?: boolean;
}
import type React from 'react';
export function NavLink({ active, disabled, className = '', children, ...props }: NavLinkProps) {
  return (
    <a
      className={cls(
        'av-nav-link',
        active && 'av-nav-link-active',
        disabled && 'av-nav-link-disabled',
        className,
      )}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </a>
  );
}
