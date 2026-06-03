import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {}
export function Masonry({ className = '', children, ...props }: MasonryProps) {
  return (
    <div className={cls('av-masonry', className)} {...props}>
      {children}
    </div>
  );
}

export interface MasonryItemProps extends HTMLAttributes<HTMLDivElement> {}
export function MasonryItem({ className = '', children, ...props }: MasonryItemProps) {
  return (
    <div className={cls('av-masonry__item', className)} {...props}>
      {children}
    </div>
  );
}
