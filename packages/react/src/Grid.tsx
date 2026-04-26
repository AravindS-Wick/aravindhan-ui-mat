import type { CSSProperties, HTMLAttributes } from 'react';
import { cls } from './types';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns. Defaults to 12. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Gap between cells. */
  gap?: CSSProperties['gap'];
  /** Responsive cols at sm breakpoint. */
  smCols?: GridProps['cols'];
  /** Responsive cols at md breakpoint. */
  mdCols?: GridProps['cols'];
  /** Responsive cols at lg breakpoint. */
  lgCols?: GridProps['cols'];
}

export function Grid({ cols = 12, gap, smCols, mdCols, lgCols, className = '', style, children, ...props }: GridProps) {
  return (
    <div
      className={cls(
        'av-grid',
        `av-grid-cols-${cols}`,
        smCols && `av-grid-sm-cols-${smCols}`,
        mdCols && `av-grid-md-cols-${mdCols}`,
        lgCols && `av-grid-lg-cols-${lgCols}`,
        className,
      )}
      style={{ ...(gap ? { gap } : {}), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span. Defaults to 1. */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Column start. */
  colStart?: number;
  /** Row span. */
  rowSpan?: number;
  /** sm breakpoint span. */
  smSpan?: GridItemProps['span'];
  /** md breakpoint span. */
  mdSpan?: GridItemProps['span'];
  /** lg breakpoint span. */
  lgSpan?: GridItemProps['span'];
}

export function GridItem({ span = 1, colStart, rowSpan, smSpan, mdSpan, lgSpan, className = '', style, children, ...props }: GridItemProps) {
  return (
    <div
      className={cls(
        'av-grid-item',
        span !== 1 && `av-col-span-${span}`,
        smSpan && `av-sm-col-span-${smSpan}`,
        mdSpan && `av-md-col-span-${mdSpan}`,
        lgSpan && `av-lg-col-span-${lgSpan}`,
        className,
      )}
      style={{
        ...(colStart ? { gridColumnStart: colStart } : {}),
        ...(rowSpan ? { gridRow: `span ${rowSpan}` } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
