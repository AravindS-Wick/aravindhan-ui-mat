import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Size modifier. */
  size?: 'sm' | 'md' | 'lg';
}

export function Kbd({ size = 'md', className = '', children, ...props }: KbdProps) {
  return (
    <kbd
      className={cls('av-kbd', size !== 'md' && `av-kbd-${size}`, className)}
      {...props}
    >
      {children}
    </kbd>
  );
}
