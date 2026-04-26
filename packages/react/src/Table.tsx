import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cls } from './types';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: ReactNode;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Allow sorting on this column. */
  sortable?: boolean;
}

export interface TableProps<T = Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string);
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  bordered?: boolean;
  loading?: boolean;
  emptyText?: ReactNode;
  stickyHeader?: boolean;
  responsive?: boolean;
  /** Called when a row is clicked. */
  onRowClick?: (row: T, index: number) => void;
  /** Called when a sortable column header is clicked. */
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
  /** Highlight row at this index (0-indexed). */
  activeRowIndex?: number;
}

type SortDir = 'asc' | 'desc' | null;

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  striped = false,
  hoverable = true,
  compact = false,
  bordered = false,
  loading = false,
  emptyText = 'No data',
  stickyHeader = false,
  responsive = true,
  onRowClick,
  onSort,
  activeRowIndex,
  className = '',
  ...props
}: TableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function getKey(row: T, i: number): string {
    if (!rowKey) return String(i);
    if (typeof rowKey === 'function') return rowKey(row);
    return String(row[rowKey]);
  }

  function handleSort(key: string) {
    let nextDir: SortDir;
    if (sortCol !== key) nextDir = 'asc';
    else if (sortDir === 'asc') nextDir = 'desc';
    else nextDir = null;
    setSortCol(nextDir ? key : null);
    setSortDir(nextDir);
    onSort?.(key, nextDir);
  }

  const tableClass = cls(
    'av-table',
    striped && 'av-table-striped',
    hoverable && 'av-table-hover',
    compact && 'av-table-compact',
    bordered && 'av-table-bordered',
    stickyHeader && 'av-table-sticky',
    className,
  );

  const table = (
    <table className={tableClass}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{ width: col.width, textAlign: col.align }}
              scope="col"
              aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              className={cls(col.sortable && 'av-table-th-sortable')}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
            >
              {col.header}
              {col.sortable && (
                <span className="av-table-sort-icon" aria-hidden="true">
                  {sortCol === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="av-table-loading">
              <span className="av-spinner av-spinner-border av-spinner-primary av-spinner-sm" role="status" aria-label="Loading" />
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="av-table-empty">{emptyText}</td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={getKey(row, i)}
              className={cls(
                activeRowIndex === i && 'av-table-row-active',
                onRowClick && 'av-table-row-clickable',
              )}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onRowClick(row, i); } : undefined}
            >
              {columns.map((col) => {
                const val = row[col.key];
                return (
                  <td key={col.key} style={{ textAlign: col.align }}>
                    {col.render ? col.render(val, row, i) : String(val ?? '')}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (responsive) {
    return <div className="av-table-responsive" {...props}>{table}</div>;
  }
  return <div {...props}>{table}</div>;
}

import { useState } from 'react';

export interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {}
export function Th({ className = '', children, ...props }: ThProps) {
  return <th className={cls('av-th', className)} scope="col" {...props}>{children}</th>;
}

export interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {}
export function Td({ className = '', children, ...props }: TdProps) {
  return <td className={cls('av-td', className)} {...props}>{children}</td>;
}
