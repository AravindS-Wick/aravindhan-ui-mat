import type { HTMLAttributes } from 'react';
import { cls } from './types';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width breakpoint. Defaults to `'lg'`. */
  size?: ContainerSize;
  /** Center horizontally. Defaults to true. */
  centered?: boolean;
}

export function Container({ size = 'lg', centered = true, className = '', children, ...props }: ContainerProps) {
  return (
    <div
      className={cls(
        size === 'fluid' ? 'av-container-fluid' : 'av-container',
        size !== 'lg' && size !== 'fluid' && `av-container-${size}`,
        centered && 'av-container-centered',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
