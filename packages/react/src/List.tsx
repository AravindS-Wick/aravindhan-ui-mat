import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Remove bullets and padding. */
  unstyled?: boolean;
  /** Bordered list with dividers. */
  bordered?: boolean;
  /** Flush (no outer border). */
  flush?: boolean;
  /** Dense padding. */
  dense?: boolean;
  /** Render as ordered list. */
  ordered?: boolean;
}

export function List({ unstyled, bordered, flush, dense, ordered = false, className = '', children, ...props }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={cls(
        'av-list',
        unstyled && 'av-list-unstyled',
        bordered && 'av-list-group',
        flush && 'av-list-group-flush',
        dense && 'av-list-dense',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Active/selected state. */
  active?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Make item clickable. */
  button?: boolean;
  /** href — renders as <a>. */
  href?: string;
  /** Secondary action slot. */
  secondaryAction?: ReactNode;
  /** List item icon slot (alias for ListItemIcon). */
  icon?: ReactNode;
}

export function ListItem({
  active,
  disabled,
  button,
  href,
  secondaryAction,
  icon,
  className = '',
  children,
  ...props
}: ListItemProps) {
  const itemClass = cls(
    'av-list-item',
    active && 'av-list-item-active',
    disabled && 'av-list-item-disabled',
    (button || href) && 'av-list-item-button',
    Boolean(icon) && 'av-list-item-with-icon',
    className,
  );

  const content = (
    <>
      {icon && <span className="av-list-item-icon">{icon}</span>}
      <span className="av-list-item-content">{children}</span>
      {secondaryAction && <span className="av-list-item-action">{secondaryAction}</span>}
    </>
  );

  if (href) {
    return (
      <li className={itemClass} {...props as LiHTMLAttributes<HTMLLIElement>}>
        <a href={href} className="av-list-item-link" aria-disabled={disabled}>{content}</a>
      </li>
    );
  }

  if (button) {
    return (
      <li className={itemClass} {...props as LiHTMLAttributes<HTMLLIElement>}>
        <button type="button" className="av-list-item-link" disabled={disabled}>{content}</button>
      </li>
    );
  }

  return <li className={itemClass} {...props}>{content}</li>;
}

export interface ListItemTextProps extends HTMLAttributes<HTMLDivElement> {
  primary: ReactNode;
  secondary?: ReactNode;
}

export function ListItemText({ primary, secondary, className = '', ...props }: ListItemTextProps) {
  return (
    <div className={cls('av-list-item-text', className)} {...props}>
      <span className="av-list-item-primary">{primary}</span>
      {secondary && <span className="av-list-item-secondary">{secondary}</span>}
    </div>
  );
}

export interface ListItemIconProps extends HTMLAttributes<HTMLSpanElement> {}

export function ListItemIcon({ className = '', children, ...props }: ListItemIconProps) {
  return (
    <span className={cls('av-list-item-icon', className)} {...props}>{children}</span>
  );
}

export interface ListItemActionProps extends HTMLAttributes<HTMLSpanElement> {}

export function ListItemAction({ className = '', children, ...props }: ListItemActionProps) {
  return (
    <span className={cls('av-list-item-action', className)} {...props}>{children}</span>
  );
}
