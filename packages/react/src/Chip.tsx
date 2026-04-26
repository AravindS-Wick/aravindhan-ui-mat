import type { HTMLAttributes, ReactNode } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Label text (or pass children). */
  label?: ReactNode;
  /** Color variant. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Outlined style. */
  outlined?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Show delete button. */
  onDelete?: () => void;
  /** Avatar element before label. */
  avatar?: ReactNode;
  /** Clickable chip — adds button role/style. */
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export function Chip({
  label,
  color = 'primary',
  size = 'md',
  outlined = false,
  icon,
  onDelete,
  avatar,
  className = '',
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cls(
        'av-chip',
        `av-chip-${color}`,
        outlined && 'av-chip-outlined',
        size !== 'md' && `av-chip-${size}`,
        props.onClick && 'av-chip-clickable',
        className,
      )}
      role={props.onClick ? 'button' : undefined}
      tabIndex={props.onClick ? 0 : undefined}
      {...props}
    >
      {avatar && <span className="av-chip-avatar">{avatar}</span>}
      {icon && <span className="av-chip-icon">{icon}</span>}
      <span className="av-chip-label">{label ?? children}</span>
      {onDelete && (
        <button
          type="button"
          className="av-chip-delete"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          &times;
        </button>
      )}
    </span>
  );
}

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap size. */
  gap?: 'sm' | 'md' | 'lg';
  /** Wrap chips. */
  wrap?: boolean;
}

export function ChipGroup({ gap = 'sm', wrap = true, className = '', children, ...props }: ChipGroupProps) {
  return (
    <div
      className={cls('av-chip-group', gap !== 'sm' && `av-chip-group-gap-${gap}`, wrap && 'av-chip-group-wrap', className)}
      {...props}
    >
      {children}
    </div>
  );
}

import type React from 'react';
