import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { cls } from './types';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Direction. Defaults to `'vertical'`. */
  direction?: 'horizontal' | 'vertical';
  /** Gap between children. */
  gap?: CSSProperties['gap'];
  /** alignItems. Defaults to `'stretch'`. */
  align?: CSSProperties['alignItems'];
  /** justifyContent. */
  justify?: CSSProperties['justifyContent'];
  /** Wrap children. */
  wrap?: boolean;
  /** Rendered element. Defaults to `'div'`. */
  as?: ElementType;
  /** Add dividers between children. */
  dividers?: boolean;
}

export function Stack({
  direction = 'vertical',
  gap,
  align,
  justify,
  wrap = false,
  as: Tag = 'div',
  dividers = false,
  className = '',
  style,
  children,
  ...props
}: StackProps) {
  return (
    <Tag
      className={cls(
        'av-stack',
        `av-stack-${direction}`,
        wrap && 'av-stack-wrap',
        dividers && 'av-stack-dividers',
        className,
      )}
      style={{
        ...(gap ? { gap } : {}),
        ...(align ? { alignItems: align } : {}),
        ...(justify ? { justifyContent: justify } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
