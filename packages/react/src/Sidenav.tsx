import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface SidenavProps extends HTMLAttributes<HTMLElement> {
  /** Collapsed (icon-only) mode. */
  collapsed?: boolean;
  /** Width when expanded. */
  width?: string;
  /** Width when collapsed. */
  collapsedWidth?: string;
  /** Variant. Defaults to `'default'`. */
  variant?: 'default' | 'floating' | 'bordered';
}

export function Sidenav({
  collapsed = false,
  width = '240px',
  collapsedWidth = '56px',
  variant = 'default',
  className = '',
  style,
  children,
  ...props
}: SidenavProps) {
  return (
    <nav
      className={cls(
        'av-sidenav',
        `av-sidenav-${variant}`,
        collapsed && 'av-sidenav-collapsed',
        className,
      )}
      style={{ width: collapsed ? collapsedWidth : width, ...style }}
      aria-label="Side navigation"
      {...props}
    >
      {children}
    </nav>
  );
}

export interface SidenavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group label (shown in expanded mode). */
  label?: string;
  /** Collapsible group. */
  collapsible?: boolean;
  /** Default open state. */
  defaultOpen?: boolean;
}

export function SidenavGroup({
  label,
  collapsible = false,
  defaultOpen = true,
  className = '',
  children,
  ...props
}: SidenavGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cls('av-sidenav-group', className)} {...props}>
      {label && (
        <div
          className={cls('av-sidenav-group-label', collapsible && 'av-sidenav-group-label-collapsible')}
          onClick={collapsible ? () => setOpen((v) => !v) : undefined}
          aria-expanded={collapsible ? open : undefined}
        >
          {label}
          {collapsible && <span className="av-sidenav-group-arrow" aria-hidden="true">{open ? '▾' : '▸'}</span>}
        </div>
      )}
      {(!collapsible || open) && (
        <ul className="av-sidenav-list">
          {children}
        </ul>
      )}
    </div>
  );
}

export interface SidenavItemProps extends HTMLAttributes<HTMLElement> {
  /** Navigation href. */
  href?: string;
  /** Active/selected state. */
  active?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing badge/count. */
  badge?: ReactNode;
  /** Nested sub-items. */
  subItems?: ReactNode;
  /** Indentation level. Defaults to 0. */
  level?: number;
  /** Tooltip label (shown in collapsed mode). */
  tooltip?: string;
}

export function SidenavItem({
  href,
  active = false,
  disabled = false,
  icon,
  badge,
  subItems,
  level = 0,
  tooltip,
  className = '',
  children,
  ...props
}: SidenavItemProps) {
  const [subOpen, setSubOpen] = useState(false);

  const itemClass = cls(
    'av-sidenav-item',
    active && 'av-sidenav-item-active',
    disabled && 'av-sidenav-item-disabled',
    level > 0 && `av-sidenav-item-level-${level}`,
    className,
  );

  const content = (
    <>
      {icon && <span className="av-sidenav-icon">{icon}</span>}
      <span className="av-sidenav-label">{children}</span>
      {badge && <span className="av-sidenav-badge">{badge}</span>}
      {subItems && (
        <span className="av-sidenav-arrow" aria-hidden="true">{subOpen ? '▾' : '▸'}</span>
      )}
    </>
  );

  const inner = href ? (
    <a
      href={href}
      className={cls('av-sidenav-link', active && 'av-sidenav-link-active')}
      aria-disabled={disabled}
      aria-current={active ? 'page' : undefined}
      title={tooltip}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      className={cls('av-sidenav-link', active && 'av-sidenav-link-active')}
      disabled={disabled}
      onClick={subItems ? () => setSubOpen((v) => !v) : undefined}
      title={tooltip}
    >
      {content}
    </button>
  );

  return (
    <li className={itemClass} {...props as HTMLAttributes<HTMLLIElement>}>
      {inner}
      {subItems && subOpen && (
        <ul className="av-sidenav-sub">{subItems}</ul>
      )}
    </li>
  );
}

export interface SidenavDividerProps extends HTMLAttributes<HTMLHRElement> {}
export function SidenavDivider({ className = '', ...props }: SidenavDividerProps) {
  return <hr className={cls('av-sidenav-divider', className)} aria-hidden="true" {...props} />;
}
