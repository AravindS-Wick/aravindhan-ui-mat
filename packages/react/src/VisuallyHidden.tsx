import type { ElementType, HTMLAttributes } from 'react';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Show on focus (useful for skip links). */
  focusable?: boolean;
}

export function VisuallyHidden({ as: Tag = 'span', focusable = false, className = '', ...props }: VisuallyHiddenProps) {
  return (
    <Tag
      className={[focusable ? 'av-sr-only-focusable' : 'av-sr-only', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
