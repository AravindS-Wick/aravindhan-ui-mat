import type { ElementType, HTMLAttributes } from 'react';
import { cls } from './types';

export interface PaperProps extends HTMLAttributes<HTMLElement> {
  /** Elevation level 0-5. Defaults to 1. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Border radius variant. Defaults to `'md'`. */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Outlined instead of shadow. */
  outlined?: boolean;
  /** Remove background. */
  transparent?: boolean;
  /** Rendered element. Defaults to `'div'`. */
  as?: ElementType;
}

export function Paper({
  elevation = 1,
  radius = 'md',
  outlined = false,
  transparent = false,
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: PaperProps) {
  return (
    <Tag
      className={cls(
        'av-paper',
        !outlined && elevation > 0 && `av-shadow-${elevation}`,
        outlined && 'av-paper-outlined',
        radius !== 'md' && `av-rounded-${radius}`,
        transparent && 'av-paper-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
