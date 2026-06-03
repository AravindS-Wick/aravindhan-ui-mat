import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface SpotlightProps extends HTMLAttributes<HTMLDivElement> {
  x?: string | number;
  y?: string | number;
  radius?: string | number;
}
export function Spotlight({ className = '', x = '50%', y = '50%', radius = '100px', children, style, ...props }: SpotlightProps) {
  return (
    <div 
      className={cls('av-spotlight', className)} 
      style={{
        '--spotlight-x': typeof x === 'number' ? `${x}px` : x,
        '--spotlight-y': typeof y === 'number' ? `${y}px` : y,
        '--spotlight-radius': typeof radius === 'number' ? `${radius}px` : radius,
        ...style
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SpotlightContentProps extends HTMLAttributes<HTMLDivElement> {
    x?: string | number;
    y?: string | number;
}
export function SpotlightContent({ className = '', x = '50%', y = '50%', children, style, ...props }: SpotlightContentProps) {
  return (
    <div 
      className={cls('av-spotlight__content', className)} 
      style={{
        '--spotlight-content-x': typeof x === 'number' ? `${x}px` : x,
        '--spotlight-content-y': typeof y === 'number' ? `${y}px` : y,
        ...style
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
