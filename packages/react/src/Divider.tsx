import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Vertical divider (for use inside flex rows). */
  vertical?: boolean;
  /** Label in the middle. */
  label?: string;
  /** Color variant. */
  variant?: 'solid' | 'dashed' | 'dotted';
}

export function Divider({ vertical = false, label, variant = 'solid', className = '', ...props }: DividerProps) {
  if (label) {
    return (
      <div className={cls('av-divider', 'av-divider-labeled', className)}>
        <span className="av-divider-label">{label}</span>
      </div>
    );
  }
  return (
    <hr
      className={cls(
        'av-divider',
        vertical && 'av-divider-vertical',
        variant !== 'solid' && `av-divider-${variant}`,
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
