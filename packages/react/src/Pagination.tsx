import type { HTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Total number of pages. */
  total: number;
  /** Current active page (1-indexed). */
  page: number;
  /** Called when a page is selected. */
  onPageChange: (page: number) => void;
  /** Number of page buttons shown (excluding prev/next). Defaults to 5. */
  siblings?: number;
  /** Size modifier. */
  size?: Size;
  /** Show first/last jump buttons. */
  showBoundary?: boolean;
  /** Aria label for the nav. */
  ariaLabel?: string;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  total,
  page,
  onPageChange,
  siblings = 2,
  size,
  showBoundary = false,
  ariaLabel = 'Pagination',
  className = '',
  ...props
}: PaginationProps) {
  const half = Math.floor(siblings / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(total, start + siblings - 1);
  if (end - start + 1 < siblings) start = Math.max(1, end - siblings + 1);

  const pages = range(start, end);

  const btnClass = (p: number) =>
    cls('av-page-item', p === page && 'av-page-item-active');

  return (
    <nav aria-label={ariaLabel} {...props}>
      <ul className={cls('av-pagination', size && `av-pagination-${size}`, className)}>
        {showBoundary && (
          <li className={cls('av-page-item', page === 1 && 'av-page-item-disabled')}>
            <button type="button" className="av-page-link" onClick={() => onPageChange(1)} disabled={page === 1}>
              «
            </button>
          </li>
        )}
        <li className={cls('av-page-item', page === 1 && 'av-page-item-disabled')}>
          <button type="button" className="av-page-link" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            ‹
          </button>
        </li>
        {start > 1 && (
          <>
            <li className="av-page-item">
              <button type="button" className="av-page-link" onClick={() => onPageChange(1)}>1</button>
            </li>
            {start > 2 && <li className="av-page-item av-page-item-ellipsis"><span className="av-page-link">…</span></li>}
          </>
        )}
        {pages.map((p) => (
          <li key={p} className={btnClass(p)}>
            <button
              type="button"
              className="av-page-link"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </li>
        ))}
        {end < total && (
          <>
            {end < total - 1 && <li className="av-page-item av-page-item-ellipsis"><span className="av-page-link">…</span></li>}
            <li className="av-page-item">
              <button type="button" className="av-page-link" onClick={() => onPageChange(total)}>{total}</button>
            </li>
          </>
        )}
        <li className={cls('av-page-item', page === total && 'av-page-item-disabled')}>
          <button type="button" className="av-page-link" onClick={() => onPageChange(page + 1)} disabled={page === total}>
            ›
          </button>
        </li>
        {showBoundary && (
          <li className={cls('av-page-item', page === total && 'av-page-item-disabled')}>
            <button type="button" className="av-page-link" onClick={() => onPageChange(total)} disabled={page === total}>
              »
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
