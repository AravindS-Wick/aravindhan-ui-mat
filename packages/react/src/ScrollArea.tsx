import type { CSSProperties, HTMLAttributes } from 'react';
import { cls } from './types';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum height before scrolling. */
  maxHeight?: string | number;
  /** Maximum width before scrolling. */
  maxWidth?: string | number;
  /** Scroll direction. Defaults to `'vertical'`. */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Show scrollbar style. Defaults to `'auto'`. */
  scrollbar?: 'auto' | 'always' | 'hidden' | 'thin';
}

function px(v: string | number) {
  return typeof v === 'number' ? `${v}px` : v;
}

export function ScrollArea({
  maxHeight,
  maxWidth,
  direction = 'vertical',
  scrollbar = 'auto',
  className = '',
  style,
  children,
  ...props
}: ScrollAreaProps) {
  const overflowStyle: CSSProperties = {
    overflowY: direction !== 'horizontal' ? (scrollbar === 'always' ? 'scroll' : scrollbar === 'hidden' ? 'hidden' : 'auto') : 'hidden',
    overflowX: direction !== 'vertical' ? (scrollbar === 'always' ? 'scroll' : scrollbar === 'hidden' ? 'hidden' : 'auto') : 'hidden',
    ...(maxHeight ? { maxHeight: px(maxHeight) } : {}),
    ...(maxWidth ? { maxWidth: px(maxWidth) } : {}),
    ...style,
  };

  return (
    <div
      className={cls(
        'av-scroll-area',
        scrollbar === 'thin' && 'av-scroll-area-thin',
        scrollbar === 'hidden' && 'av-scroll-area-hidden',
        className,
      )}
      style={overflowStyle}
      {...props}
    >
      {children}
    </div>
  );
}
