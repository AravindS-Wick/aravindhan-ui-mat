import { useState, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, type Placement } from './types';

export interface DropdownItemProps extends HTMLAttributes<HTMLElement> {
  /** Render as a divider line. */
  divider?: boolean;
  /** Render as a non-interactive header. */
  header?: boolean;
  /** Disable this item. */
  disabled?: boolean;
  /** href to render as <a> instead of <button>. */
  href?: string;
  icon?: ReactNode;
}

export function DropdownItem({
  divider = false,
  header = false,
  disabled = false,
  href,
  icon,
  className = '',
  children,
  ...props
}: DropdownItemProps) {
  if (divider) return <li role="separator" className="av-dropdown-divider" />;
  if (header) return <li className={cls('av-dropdown-header', className)}>{children}</li>;

  const itemClass = cls('av-dropdown-item', disabled && 'av-dropdown-item-disabled', className);

  return (
    <li>
      {href ? (
        <a href={href} className={itemClass} aria-disabled={disabled} tabIndex={disabled ? -1 : 0} {...props as AnchorHTMLAttributes<HTMLAnchorElement>}>
          {icon && <span className="av-dropdown-item-icon">{icon}</span>}
          {children}
        </a>
      ) : (
        <button type="button" className={itemClass} disabled={disabled} {...props as ButtonHTMLAttributes<HTMLButtonElement>}>
          {icon && <span className="av-dropdown-item-icon">{icon}</span>}
          {children}
        </button>
      )}
    </li>
  );
}

type AnchorHTMLAttributes<T> = React.AnchorHTMLAttributes<T>;
type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element (button, icon, etc.). */
  trigger: ReactNode;
  /** Dropdown placement. Defaults to `'bottom'`. */
  placement?: Placement | 'bottom-end' | 'bottom-start';
  /** Close on item click. Defaults to true. */
  closeOnClick?: boolean;
}

export function Dropdown({
  trigger,
  placement = 'bottom',
  closeOnClick = true,
  className = '',
  children,
  ...props
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const menuClass = cls(
    'av-dropdown-menu',
    open && 'av-dropdown-menu-open',
    placement === 'bottom-end' && 'av-dropdown-menu-end',
    placement === 'top' && 'av-dropdown-menu-top',
  );

  return (
    <div ref={ref} className={cls('av-dropdown', className)} {...props}>
      <div
        className="av-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {trigger}
      </div>
      <ul
        className={menuClass}
        role="listbox"
        onClick={() => { if (closeOnClick) setOpen(false); }}
      >
        {children}
      </ul>
    </div>
  );
}
