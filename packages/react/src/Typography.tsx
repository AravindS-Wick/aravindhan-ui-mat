import type { ElementType, HTMLAttributes } from 'react';
import { cls } from './types';

export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'caption' | 'overline' | 'label';

const TAG_MAP: Record<TypographyVariant, ElementType> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  subtitle1: 'p', subtitle2: 'p',
  body1: 'p', body2: 'p',
  caption: 'span', overline: 'span', label: 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** Visual + semantic variant. Defaults to `'body1'`. */
  variant?: TypographyVariant;
  /** Override rendered element. */
  as?: ElementType;
  /** Truncate with ellipsis after N lines. */
  clamp?: number;
  /** Muted/secondary color. */
  muted?: boolean;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Font weight. */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  /** No bottom margin. */
  gutterBottom?: boolean;
}

export function Typography({
  variant = 'body1',
  as,
  clamp,
  muted = false,
  align,
  weight,
  gutterBottom = false,
  className = '',
  style,
  children,
  ...props
}: TypographyProps) {
  const Tag = as ?? TAG_MAP[variant];
  return (
    <Tag
      className={cls(
        `av-${variant}`,
        muted && 'av-text-muted',
        align && `av-text-${align}`,
        weight && `av-font-${weight}`,
        gutterBottom && 'av-mb',
        Boolean(clamp) && 'av-line-clamp',
        className,
      )}
      style={{ ...(clamp ? { WebkitLineClamp: clamp } : {}), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
