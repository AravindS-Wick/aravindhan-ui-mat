import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  blur?: 'none' | 'sm' | 'md' | 'lg';
}
export function Backdrop({ className = '', visible = true, blur = 'md', children, ...props }: BackdropProps) {
  return (
    <div 
      className={cls(
        'av-backdrop', 
        visible && 'av-backdrop--visible',
        blur !== 'md' && `av-backdrop--blur-${blur}`,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
