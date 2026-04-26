import type { HTMLAttributes, ReactNode } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Bordered/outlined style. */
  outlined?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Dismiss handler. */
  onClose?: () => void;
  /** Dot indicator before label. */
  dot?: boolean;
}

export function Tag({ color = 'primary', size = 'md', outlined, icon, onClose, dot, className = '', children, ...props }: TagProps) {
  return (
    <span
      className={cls(
        'av-tag',
        `av-tag-${color}`,
        outlined && 'av-tag-outlined',
        size !== 'md' && `av-tag-${size}`,
        className,
      )}
      {...props}
    >
      {dot && <span className={`av-tag-dot av-tag-dot-${color}`} aria-hidden="true" />}
      {icon && <span className="av-tag-icon">{icon}</span>}
      {children}
      {onClose && (
        <button type="button" className="av-tag-close" aria-label="Remove tag" onClick={onClose}>
          &times;
        </button>
      )}
    </span>
  );
}

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  wrap?: boolean;
}

export function TagGroup({ wrap = true, className = '', children, ...props }: TagGroupProps) {
  return (
    <div className={cls('av-tag-group', wrap && 'av-tag-group-wrap', className)} {...props}>
      {children}
    </div>
  );
}
