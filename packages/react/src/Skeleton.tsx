import type { HTMLAttributes } from 'react';
import { cls } from './types';

export type SkeletonVariant = 'text' | 'rect' | 'circle' | 'button' | 'avatar' | 'card';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape preset. Defaults to `'text'`. */
  variant?: SkeletonVariant;
  /** Width (CSS value or number in px). */
  width?: string | number;
  /** Height (CSS value or number in px). */
  height?: string | number;
  /** Number of repeated skeleton lines. */
  lines?: number;
  /** Animation type. Defaults to `'pulse'`. */
  animation?: 'pulse' | 'wave' | 'none';
}

function px(v: string | number) {
  return typeof v === 'number' ? `${v}px` : v;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const computed = cls(
    'av-skeleton',
    `av-skeleton-${variant}`,
    animation !== 'none' && `av-skeleton-${animation}`,
    className,
  );

  const inlineStyle = {
    ...(width ? { width: px(width) } : {}),
    ...(height ? { height: px(height) } : {}),
    ...style,
  };

  if (lines && lines > 1) {
    return (
      <div className="av-skeleton-group" {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={computed}
            style={i === lines - 1 ? { ...inlineStyle, width: '70%' } : inlineStyle}
          />
        ))}
      </div>
    );
  }

  return <div className={computed} style={inlineStyle} {...props} />;
}
