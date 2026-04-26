import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Vertical padding size. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Use full-width background. */
  fullWidth?: boolean;
}

export function Section({ size = 'md', fullWidth = false, className = '', children, ...props }: SectionProps) {
  return (
    <section
      className={cls('av-section', `av-section-${size}`, fullWidth && 'av-section-full', className)}
      {...props}
    >
      {children}
    </section>
  );
}
