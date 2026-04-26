import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Ratio as `'W/H'` string or number. Defaults to `'16/9'`. */
  ratio?: string | number;
}

export function AspectRatio({ ratio = '16/9', className = '', style, children, ...props }: AspectRatioProps) {
  return (
    <div
      className={cls('av-aspect-ratio', className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
