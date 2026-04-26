import type { HTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Size applied to all buttons. */
  size?: Size;
  /** Vertical layout. */
  vertical?: boolean;
  /** Stretch to fill container. */
  fluid?: boolean;
}

export function ButtonGroup({ size, vertical = false, fluid = false, className = '', children, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cls(
        'av-btn-group',
        vertical && 'av-btn-group-vertical',
        fluid && 'av-btn-group-fluid',
        size && `av-btn-group-${size}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
