import { useState, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cls } from './types';

export interface MenuDividerProps { className?: string; }
export function MenuDivider({ className = '' }: MenuDividerProps) {
  return <li role="separator" className={cls('av-menu-divider', className)} />;
}

export interface MenuItemProps extends HTMLAttributes<HTMLElement> {
  /** Disable this item. */
  disabled?: boolean;
  /** Icon before label. */
  icon?: ReactNode;
  /** Trailing shortcut hint. */
  shortcut?: string;
  /** Href — renders as <a>. */
  href?: string;
  /** Destructive style. */
  danger?: boolean;
  /** Sub-menu items. */
  submenu?: ReactNode;
}

export function MenuItem({
  disabled,
  icon,
  shortcut,
  href,
  danger,
  submenu,
  className = '',
  children,
  ...props
}: MenuItemProps) {
  const [subOpen, setSubOpen] = useState(false);
  const itemClass = cls(
    'av-menu-item',
    disabled && 'av-menu-item-disabled',
    danger && 'av-menu-item-danger',
    Boolean(submenu) && 'av-menu-item-has-sub',
    className,
  );

  const content = (
    <>
      {icon && <span className="av-menu-item-icon">{icon}</span>}
      <span className="av-menu-item-label">{children}</span>
      {shortcut && <span className="av-menu-item-shortcut">{shortcut}</span>}
      {submenu && <span className="av-menu-item-arrow" aria-hidden="true">›</span>}
    </>
  );

  if (submenu) {
    return (
      <li
        className={itemClass}
        onMouseEnter={() => setSubOpen(true)}
        onMouseLeave={() => setSubOpen(false)}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={subOpen}
        {...props as HTMLAttributes<HTMLLIElement>}
      >
        {content}
        {subOpen && <ul className="av-menu av-menu-sub">{submenu}</ul>}
      </li>
    );
  }

  if (href) {
    return (
      <li role="none">
        <a href={href} className={itemClass} role="menuitem" aria-disabled={disabled} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}>
          {content}
        </a>
      </li>
    );
  }

  return (
    <li
      role="menuitem"
      className={itemClass}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      {...props as HTMLAttributes<HTMLLIElement>}
    >
      {content}
    </li>
  );
}

export interface MenuProps {
  /** Trigger element. */
  trigger: ReactNode;
  /** Close on item click. Defaults to true. */
  closeOnSelect?: boolean;
  className?: string;
  children: ReactNode;
  /** Placement. */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export function Menu({ trigger, closeOnSelect = true, placement = 'bottom-start', className = '', children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', keyHandler); };
  }, [open]);

  const menuClass = cls(
    'av-menu',
    open && 'av-menu-open',
    `av-menu-${placement}`,
    className,
  );

  return (
    <div ref={ref} className="av-menu-wrapper">
      <div
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>
      {open && (
        <ul
          className={menuClass}
          role="menu"
          onClick={() => { if (closeOnSelect) setOpen(false); }}
        >
          {children}
        </ul>
      )}
    </div>
  );
}

import type React from 'react';
