import { useState, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  header: ReactNode;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Hide this column from the visibility toggle. */
  alwaysVisible?: boolean;
}

export interface DataTableProps<T = Record<string, unknown>> extends HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string);
  sortable?: boolean;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** Called when a row is clicked. */
  onRowClick?: (row: T, index: number) => void;
  /** Render expanded row content. Enables expand toggle per row. */
  expandedRowRender?: (row: T, index: number) => ReactNode;
  /** Called when sort changes. */
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
  /** Called when filter query changes. */
  onFilter?: (query: string) => void;
  /** Server-side filter (disables client-side filtering when provided). */
  filterValue?: string;
  pageSize?: number;
  loading?: boolean;
  emptyText?: ReactNode;
  toolbar?: ReactNode;
  /** Show column visibility toggle button. */
  columnVisibility?: boolean;
  /** Show CSV export button. */
  exportable?: boolean;
  /** Filename for CSV export. Defaults to `'export'`. */
  exportFilename?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, unknown>>({
  columns: initialColumns,
  data,
  rowKey,
  sortable = false,
  selectable = false,
  selectedKeys: controlledSelected,
  onSelectionChange,
  onRowClick,
  expandedRowRender,
  onSort,
  onFilter,
  filterValue: controlledFilter,
  pageSize = 10,
  loading = false,
  emptyText = 'No data',
  toolbar,
  columnVisibility = false,
  exportable = false,
  exportFilename = 'export',
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = false,
  className = '',
  ...props
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalFilter, setInternalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  const selected = controlledSelected ?? internalSelected;
  const filterQuery = controlledFilter ?? internalFilter;

  const columns = initialColumns.filter((c) => !hiddenCols.has(c.key));

  function getKey(row: T, i: number): string {
    if (!rowKey) return String(i);
    if (typeof rowKey === 'function') return rowKey(row);
    return String(row[rowKey]);
  }

  function handleSort(key: string) {
    if (!sortable) return;
    let nextDir: SortDir;
    if (sortCol !== key) nextDir = 'asc';
    else if (sortDir === 'asc') nextDir = 'desc';
    else nextDir = null;
    setSortCol(nextDir ? key : null);
    setSortDir(nextDir);
    setPage(1);
    onSort?.(key, nextDir);
  }

  function handleFilter(q: string) {
    setInternalFilter(q);
    setPage(1);
    onFilter?.(q);
  }

  const filtered = useMemo(() => {
    if (!filterQuery || controlledFilter !== undefined) return data;
    const q = filterQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)),
    );
  }, [data, filterQuery, controlledFilter]);

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortCol] ?? '').localeCompare(String(b[sortCol] ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
  const paged = pageSize > 0 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  function toggleAll() {
    const allKeys = paged.map((r, i) => getKey(r, (page - 1) * pageSize + i));
    const next = selected.length === allKeys.length ? [] : allKeys;
    setInternalSelected(next);
    onSelectionChange?.(next);
  }

  function toggleRow(key: string) {
    const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
    setInternalSelected(next);
    onSelectionChange?.(next);
  }

  function toggleExpand(key: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleColVisibility(key: string) {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function exportCSV() {
    const visibleCols = initialColumns.filter((c) => !hiddenCols.has(c.key));
    const header = visibleCols.map((c) => typeof c.header === 'string' ? c.header : c.key).join(',');
    const rows = sorted.map((row) =>
      visibleCols.map((c) => {
        const val = row[c.key];
        const str = String(val ?? '').replace(/"/g, '""');
        return str.includes(',') || str.includes('"') ? `"${str}"` : str;
      }).join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const allSelected = paged.length > 0 && paged.every((r, i) => selected.includes(getKey(r, (page - 1) * pageSize + i)));
  const someSelected = !allSelected && paged.some((r, i) => selected.includes(getKey(r, (page - 1) * pageSize + i)));

  return (
    <div className={cls('av-data-table', className)} {...props}>
      {/* Toolbar row */}
      <div className="av-data-table-toolbar">
        {toolbar}
        <div className="av-data-table-toolbar-actions">
          {/* Built-in search */}
          {onFilter !== undefined || controlledFilter === undefined ? (
            <input
              type="search"
              className="av-input av-input-sm"
              placeholder="Search…"
              value={controlledFilter ?? internalFilter}
              onChange={(e) => handleFilter(e.target.value)}
              aria-label="Filter table"
            />
          ) : null}
          {/* Column visibility */}
          {columnVisibility && (
            <div className="av-data-table-col-visibility">
              <button type="button" className="av-btn av-btn-ghost av-btn-sm">Columns ▾</button>
              <ul className="av-dropdown-menu av-data-table-col-menu">
                {initialColumns.filter((c) => !c.alwaysVisible).map((col) => (
                  <li key={col.key}>
                    <label className="av-form-check">
                      <input
                        type="checkbox"
                        className="av-form-check-input"
                        checked={!hiddenCols.has(col.key)}
                        onChange={() => toggleColVisibility(col.key)}
                      />
                      <span className="av-form-check-label">
                        {typeof col.header === 'string' ? col.header : col.key}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* CSV export */}
          {exportable && (
            <button type="button" className="av-btn av-btn-ghost av-btn-sm" onClick={exportCSV}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="av-table-responsive">
        <table
          className={cls(
            'av-table',
            striped && 'av-table-striped',
            hoverable && 'av-table-hover',
            compact && 'av-table-compact',
            bordered && 'av-table-bordered',
            stickyHeader && 'av-table-sticky',
            (onRowClick || expandedRowRender) && 'av-table-interactive',
          )}
        >
          <thead>
            <tr>
              {expandedRowRender && <th style={{ width: '40px' }} aria-label="Expand" />}
              {selectable && (
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="av-checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align }}
                  scope="col"
                  aria-sort={
                    sortCol === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                  className={cls((col.sortable || sortable) && 'av-table-th-sortable')}
                  onClick={(col.sortable || sortable) ? () => handleSort(col.key) : undefined}
                >
                  {col.header}
                  {(col.sortable || sortable) && (
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
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (expandedRowRender ? 1 : 0)}
                  className="av-table-loading"
                >
                  <span
                    className="av-spinner av-spinner-border av-spinner-primary av-spinner-sm"
                    role="status"
                    aria-label="Loading table data"
                  />
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (expandedRowRender ? 1 : 0)}
                  className="av-table-empty"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => {
                const absIndex = (page - 1) * pageSize + i;
                const key = getKey(row, absIndex);
                const isSelected = selected.includes(key);
                const isExpanded = expandedRows.has(key);

                return (
                  <>
                    <tr
                      key={key}
                      className={cls(
                        isSelected && 'av-table-row-selected',
                        onRowClick && 'av-table-row-clickable',
                        isExpanded && 'av-table-row-expanded',
                      )}
                      onClick={onRowClick ? () => onRowClick(row, absIndex) : undefined}
                      tabIndex={onRowClick ? 0 : undefined}
                      onKeyDown={onRowClick ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onRowClick(row, absIndex);
                      } : undefined}
                      aria-selected={selectable ? isSelected : undefined}
                    >
                      {expandedRowRender && (
                        <td>
                          <button
                            type="button"
                            className="av-table-expand-btn"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                            onClick={(e) => { e.stopPropagation(); toggleExpand(key); }}
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                      )}
                      {selectable && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="av-checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(key)}
                            aria-label={`Select row ${absIndex + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} style={{ textAlign: col.align }}>
                          {col.render
                            ? col.render(row[col.key], row, absIndex)
                            : String(row[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && expandedRowRender && (
                      <tr key={`${key}-expanded`} className="av-table-row-expand-content">
                        <td
                          colSpan={columns.length + (selectable ? 1 : 0) + 1}
                          className="av-table-expand-cell"
                        >
                          {expandedRowRender(row, absIndex)}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="av-data-table-footer">
          <span className="av-data-table-count">
            {Math.min((page - 1) * pageSize + 1, sorted.length)}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
            {selected.length > 0 && ` · ${selected.length} selected`}
          </span>
          <nav aria-label="Table pagination">
            <ul className="av-pagination av-pagination-sm">
              <li className={cls('av-page-item', page === 1 && 'av-page-item-disabled')}>
                <button type="button" className="av-page-link" onClick={() => setPage(1)} disabled={page === 1}>«</button>
              </li>
              <li className={cls('av-page-item', page === 1 && 'av-page-item-disabled')}>
                <button type="button" className="av-page-link" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>‹</button>
              </li>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                const p = Math.max(1, Math.min(page - 3, totalPages - 6)) + idx;
                return p <= totalPages ? (
                  <li key={p} className={cls('av-page-item', p === page && 'av-page-item-active')}>
                    <button type="button" className="av-page-link" onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}>{p}</button>
                  </li>
                ) : null;
              })}
              <li className={cls('av-page-item', page === totalPages && 'av-page-item-disabled')}>
                <button type="button" className="av-page-link" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>›</button>
              </li>
              <li className={cls('av-page-item', page === totalPages && 'av-page-item-disabled')}>
                <button type="button" className="av-page-link" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
