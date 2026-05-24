import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
  type ClipboardEvent,
  type MouseEvent,
} from 'react';
import { cls } from './types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DataGridCellType = 'text' | 'number' | 'select' | 'date' | 'boolean';

export interface DataGridColumn<T = Record<string, unknown>> {
  key: string;
  header: ReactNode;
  width?: number;
  minWidth?: number;
  editable?: boolean;
  type?: DataGridCellType;
  /** Options for 'select' type cells. */
  options?: { label: string; value: string }[];
  align?: 'left' | 'center' | 'right';
  pinned?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode;
  /** Validates new value. Return error message or null. */
  validate?: (value: unknown, row: T) => string | null;
  /** Format raw value for display (not applied during editing). */
  format?: (value: unknown) => string;
}

export interface DataGridProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: DataGridColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string);
  /** Called whenever any cell value changes. */
  onChange?: (updatedData: T[]) => void;
  /** Called when a single cell changes. */
  onCellChange?: (rowIndex: number, key: string, value: unknown, row: T) => void;
  sortable?: boolean;
  resizableColumns?: boolean;
  reorderableRows?: boolean;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  pageSize?: number;
  loading?: boolean;
  emptyText?: ReactNode;
  exportable?: boolean;
  exportFilename?: string;
  /** Allow paste of TSV data (from Excel/Sheets) into selected cell range. */
  pasteable?: boolean;
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
  maxHeight?: string;
  toolbar?: ReactNode;
}

interface CellAddress { row: number; col: number }
type SortDir = 'asc' | 'desc' | null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getKey<T extends Record<string, unknown>>(
  row: T,
  index: number,
  rowKey?: DataGridProps<T>['rowKey'],
): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey]);
}

function parseTSV(text: string): string[][] {
  return text
    .trim()
    .split('\n')
    .map((line) => line.split('\t'));
}

function coerce(value: string, type: DataGridCellType = 'text'): unknown {
  if (type === 'number') {
    const n = parseFloat(value.replace(/,/g, ''));
    return isNaN(n) ? value : n;
  }
  if (type === 'boolean') return value.toLowerCase() === 'true' || value === '1';
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function displayValue(value: unknown, col: DataGridColumn<any>): string {
  if (value === null || value === undefined) return '';
  if (col.format) return col.format(value);
  return String(value);
}

// ── Cell editor ───────────────────────────────────────────────────────────────

interface CellEditorProps {
  value: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  col: DataGridColumn<any>;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
  onTab: (shift: boolean) => void;
}

function CellEditor({ value, col, onCommit, onCancel, onTab }: CellEditorProps) {
  const [draft, setDraft] = useState(value === null || value === undefined ? '' : String(value));
  const ref = useRef<HTMLInputElement & HTMLSelectElement>(null);

  useEffect(() => { ref.current?.select(); }, []);

  function commit() { onCommit(coerce(draft, col.type)); }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    else if (e.key === 'Tab') { e.preventDefault(); commit(); onTab(e.shiftKey); }
  }

  if (col.type === 'select' && col.options) {
    return (
      <select
        ref={ref as React.RefObject<HTMLSelectElement>}
        className="av-dg-cell-editor av-select"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        autoFocus
      >
        {col.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  if (col.type === 'boolean') {
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        type="checkbox"
        className="av-checkbox av-dg-cell-editor"
        checked={draft === 'true' || draft === '1'}
        onChange={(e) => { setDraft(e.target.checked ? 'true' : 'false'); commit(); }}
        onKeyDown={onKey}
        autoFocus
      />
    );
  }

  return (
    <input
      ref={ref as React.RefObject<HTMLInputElement>}
      className="av-dg-cell-editor av-input av-input-sm"
      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={onKey}
      autoFocus
    />
  );
}

// ── Main DataGrid ─────────────────────────────────────────────────────────────

export function DataGrid<T extends Record<string, unknown>>({
  columns,
  data: rawData,
  rowKey,
  onChange,
  onCellChange,
  sortable = false,
  resizableColumns = true,
  reorderableRows = false,
  selectable = false,
  selectedKeys: controlledSelected,
  onSelectionChange,
  pageSize = 0,
  loading = false,
  emptyText = 'No data',
  exportable = false,
  exportFilename = 'export',
  pasteable = true,
  stickyHeader = true,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  className = '',
  maxHeight = '600px',
  toolbar,
}: DataGridProps<T>) {
  const [data, setData] = useState<T[]>(rawData);
  const [editingCell, setEditingCell] = useState<CellAddress | null>(null);
  const [activeCell, setActiveCell] = useState<CellAddress | null>(null);
  const [selectionRange, setSelectionRange] = useState<{ start: CellAddress; end: CellAddress } | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [colWidths, setColWidths] = useState<Map<string, number>>(
    () => new Map(columns.map((c) => [c.key, c.width ?? 160])),
  );
  const [dragRowIndex, setDragRowIndex] = useState<number | null>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const selected = controlledSelected ?? internalSelected;
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  // Keep internal data in sync when prop changes
  useEffect(() => { setData(rawData); }, [rawData]);

  // ── Sorting ──────────────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    if (!sortCol || !sortDir) return data;
    return [...data].sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol];
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir]);

  const totalPages = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
  const paged = pageSize > 0 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  // ── Data mutation ────────────────────────────────────────────────────────────

  const commitCell = useCallback(
    (rowIndex: number, key: string, value: unknown) => {
      const col = columns.find((c) => c.key === key);
      const row = data[rowIndex];
      const errorKey = `${rowIndex}-${key}`;

      if (col?.validate) {
        const err = col.validate(value, row);
        setErrors((prev) => {
          const next = new Map(prev);
          if (err) next.set(errorKey, err);
          else next.delete(errorKey);
          return next;
        });
        if (err) return;
      }

      const updated = data.map((r, i) =>
        i === rowIndex ? { ...r, [key]: value } : r,
      ) as T[];
      setData(updated);
      onChange?.(updated);
      onCellChange?.(rowIndex, key, value, updated[rowIndex]);
    },
    [data, columns, onChange, onCellChange],
  );

  // ── Paste handler ─────────────────────────────────────────────────────────────

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      if (!pasteable || !activeCell) return;
      const text = e.clipboardData.getData('text/plain');
      if (!text) return;
      e.preventDefault();

      const rows = parseTSV(text);
      const editableColumns = columns.filter((c) => c.editable !== false);
      const startCol = activeCell.col;
      const startRow = activeCell.row;

      let updated = [...data] as T[];
      rows.forEach((pasteRow, ri) => {
        const dataRowIndex = startRow + ri;
        if (dataRowIndex >= data.length) return;
        pasteRow.forEach((cellText, ci) => {
          const colIndex = startCol + ci;
          if (colIndex >= editableColumns.length) return;
          const col = editableColumns[colIndex];
          updated = updated.map((r, i) =>
            i === dataRowIndex ? { ...r, [col.key]: coerce(cellText, col.type) } : r,
          ) as T[];
        });
      });
      setData(updated);
      onChange?.(updated);
    },
    [pasteable, activeCell, columns, data, onChange],
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────────

  const editableCols = useMemo(() => columns.filter((c) => c.editable !== false), [columns]);

  const navigate = useCallback(
    (rowDelta: number, colDelta: number, shift = false) => {
      if (!activeCell) return;
      const newRow = Math.max(0, Math.min(paged.length - 1, activeCell.row + rowDelta));
      const newCol = Math.max(0, Math.min(editableCols.length - 1, activeCell.col + colDelta));
      setEditingCell(null);
      setActiveCell({ row: newRow, col: newCol });
      if (shift && activeCell) {
        setSelectionRange((prev) => ({
          start: prev?.start ?? activeCell,
          end: { row: newRow, col: newCol },
        }));
      } else {
        setSelectionRange(null);
      }
    },
    [activeCell, paged.length, editableCols.length],
  );

  const handleGridKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!activeCell || editingCell) return;
      const { key, shiftKey, ctrlKey, metaKey } = e;

      if (key === 'Enter' || key === 'F2') {
        e.preventDefault();
        setEditingCell(activeCell);
      } else if (key === 'Delete' || key === 'Backspace') {
        e.preventDefault();
        const col = editableCols[activeCell.col];
        if (col?.editable !== false) commitCell(activeCell.row, col.key, '');
      } else if (key === 'ArrowDown') { e.preventDefault(); navigate(1, 0, shiftKey); }
      else if (key === 'ArrowUp') { e.preventDefault(); navigate(-1, 0, shiftKey); }
      else if (key === 'ArrowRight') { e.preventDefault(); navigate(0, 1, shiftKey); }
      else if (key === 'ArrowLeft') { e.preventDefault(); navigate(0, -1, shiftKey); }
      else if (key === 'Tab') { e.preventDefault(); navigate(0, shiftKey ? -1 : 1); }
      else if (key === 'Home') { e.preventDefault(); setActiveCell({ row: activeCell.row, col: 0 }); }
      else if (key === 'End') { e.preventDefault(); setActiveCell({ row: activeCell.row, col: editableCols.length - 1 }); }
      else if ((ctrlKey || metaKey) && key === 'a') {
        e.preventDefault();
        setSelectionRange({ start: { row: 0, col: 0 }, end: { row: paged.length - 1, col: editableCols.length - 1 } });
      } else if ((ctrlKey || metaKey) && key === 'c') {
        // Copy selected range to clipboard
        const start = selectionRange?.start ?? activeCell;
        const end = selectionRange?.end ?? activeCell;
        const minR = Math.min(start.row, end.row);
        const maxR = Math.max(start.row, end.row);
        const minC = Math.min(start.col, end.col);
        const maxC = Math.max(start.col, end.col);
        const lines: string[] = [];
        for (let r = minR; r <= maxR; r++) {
          const row = paged[r];
          if (!row) continue;
          lines.push(
            editableCols.slice(minC, maxC + 1).map((c) => String(row[c.key] ?? '')).join('\t'),
          );
        }
        navigator.clipboard?.writeText(lines.join('\n'));
      } else if (key.length === 1 && !ctrlKey && !metaKey) {
        // Start typing — begin edit mode with the typed char
        setEditingCell(activeCell);
      }
    },
    [activeCell, editingCell, editableCols, navigate, commitCell, paged, selectionRange],
  );

  // ── Column resize ─────────────────────────────────────────────────────────────

  function startResize(e: MouseEvent, key: string) {
    e.preventDefault();
    resizeRef.current = { key, startX: e.clientX, startWidth: colWidths.get(key) ?? 160 };

    function onMove(ev: globalThis.MouseEvent) {
      if (!resizeRef.current) return;
      const delta = ev.clientX - resizeRef.current.startX;
      const newWidth = Math.max(resizeRef.current.startWidth + delta, 60);
      setColWidths((prev) => new Map(prev).set(resizeRef.current!.key, newWidth));
    }

    function onUp() {
      resizeRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // ── Row drag-reorder ──────────────────────────────────────────────────────────

  function handleDragStart(index: number) {
    setDragRowIndex(index);
  }

  function handleDrop(targetIndex: number) {
    if (dragRowIndex === null || dragRowIndex === targetIndex) return;
    const updated = [...data];
    const [moved] = updated.splice(dragRowIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setData(updated as T[]);
    onChange?.(updated as T[]);
    setDragRowIndex(null);
  }

  // ── Selection ────────────────────────────────────────────────────────────────

  function toggleRow(key: string) {
    const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
    setInternalSelected(next);
    onSelectionChange?.(next);
  }

  function toggleAll() {
    const allKeys = paged.map((r, i) => getKey(r, i, rowKey));
    const next = selected.length === allKeys.length ? [] : allKeys;
    setInternalSelected(next);
    onSelectionChange?.(next);
  }

  const allSelected = paged.length > 0 && paged.every((r, i) => selected.includes(getKey(r, i, rowKey)));
  const someSelected = !allSelected && paged.some((r, i) => selected.includes(getKey(r, i, rowKey)));

  // ── CSV export ────────────────────────────────────────────────────────────────

  function exportCSV() {
    const header = columns.map((c) => typeof c.header === 'string' ? c.header : c.key).join(',');
    const rows = data.map((row) =>
      columns.map((c) => {
        const val = String(row[c.key] ?? '').replace(/"/g, '""');
        return val.includes(',') || val.includes('"') ? `"${val}"` : val;
      }).join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${exportFilename}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Cell in-selection check ───────────────────────────────────────────────────

  function inSelection(row: number, col: number): boolean {
    if (!selectionRange) return false;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
    return row >= minR && row <= maxR && col >= minC && col <= maxC;
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      className={cls('av-datagrid', className)}
      ref={containerRef}
      onKeyDown={handleGridKeyDown}
      onPaste={handlePaste}
      tabIndex={0}
      role="grid"
      aria-label="Data grid"
      aria-rowcount={data.length + 1}
      aria-colcount={columns.length}
    >
      {/* Toolbar */}
      <div className="av-datagrid-toolbar">
        {toolbar}
        <div className="av-datagrid-toolbar-actions">
          {exportable && (
            <button type="button" className="av-btn av-btn-ghost av-btn-sm" onClick={exportCSV}>
              Export CSV
            </button>
          )}
          {selected.length > 0 && (
            <span className="av-datagrid-selection-count">{selected.length} selected</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        className="av-datagrid-scroll"
        style={{ maxHeight, overflow: 'auto' }}
      >
        <table
          className={cls(
            'av-table av-datagrid-table',
            striped && 'av-table-striped',
            hoverable && 'av-table-hover',
            compact && 'av-table-compact',
            bordered && 'av-table-bordered',
            stickyHeader && 'av-table-sticky',
          )}
          role="grid"
        >
          <colgroup>
            {reorderableRows && <col style={{ width: '36px' }} />}
            {selectable && <col style={{ width: '40px' }} />}
            {columns.map((col) => (
              <col key={col.key} style={{ width: `${colWidths.get(col.key) ?? 160}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr role="row">
              {reorderableRows && <th className="av-datagrid-th av-datagrid-th-drag" aria-label="Drag" />}
              {selectable && (
                <th className="av-datagrid-th" role="columnheader">
                  <input
                    type="checkbox"
                    className="av-checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cls(
                    'av-datagrid-th',
                    col.sortable && 'av-datagrid-th-sortable',
                    col.pinned && `av-datagrid-th-pinned-${col.pinned}`,
                  )}
                  style={{ textAlign: col.align, width: `${colWidths.get(col.key) ?? 160}px` }}
                  role="columnheader"
                  aria-sort={
                    sortCol === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  onClick={col.sortable && sortable ? () => {
                    if (sortCol !== col.key) { setSortCol(col.key); setSortDir('asc'); }
                    else if (sortDir === 'asc') setSortDir('desc');
                    else { setSortCol(null); setSortDir(null); }
                  } : undefined}
                >
                  <span className="av-datagrid-th-content">
                    {col.header}
                    {(col.sortable || sortable) && (
                      <span className="av-table-sort-icon" aria-hidden="true">
                        {sortCol === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                    {col.editable !== false && (
                      <span className="av-datagrid-editable-indicator" aria-hidden="true" title="Editable" />
                    )}
                  </span>
                  {resizableColumns && (
                    <span
                      className="av-datagrid-resize-handle"
                      onMouseDown={(e) => startResize(e, col.key)}
                      aria-hidden="true"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (reorderableRows ? 1 : 0)} className="av-table-loading">
                  <span className="av-spinner av-spinner-border av-spinner-primary av-spinner-sm" role="status" aria-label="Loading" />
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (reorderableRows ? 1 : 0)} className="av-table-empty">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => {
                const key = getKey(row, ri, rowKey);
                const isSelected = selected.includes(key);

                return (
                  <tr
                    key={key}
                    role="row"
                    className={cls(
                      isSelected && 'av-table-row-selected',
                      dragRowIndex === ri && 'av-datagrid-row-dragging',
                    )}
                    draggable={reorderableRows}
                    onDragStart={reorderableRows ? () => handleDragStart(ri) : undefined}
                    onDragOver={reorderableRows ? (e) => e.preventDefault() : undefined}
                    onDrop={reorderableRows ? () => handleDrop(ri) : undefined}
                    aria-selected={isSelected}
                    aria-rowindex={ri + 2}
                  >
                    {reorderableRows && (
                      <td className="av-datagrid-drag-handle" aria-label="Drag to reorder">
                        <span aria-hidden="true">⠿</span>
                      </td>
                    )}
                    {selectable && (
                      <td role="gridcell">
                        <input
                          type="checkbox"
                          className="av-checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          aria-label={`Select row ${ri + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col, ci) => {
                      const isActive = activeCell?.row === ri && activeCell?.col === ci;
                      const isEditing = editingCell?.row === ri && editingCell?.col === ci;
                      const isInSel = inSelection(ri, ci);
                      const errorKey = `${ri}-${col.key}`;
                      const error = errors.get(errorKey);
                      const editable = col.editable !== false;

                      return (
                        <td
                          key={col.key}
                          role="gridcell"
                          aria-colindex={ci + 1}
                          className={cls(
                            'av-datagrid-cell',
                            isActive && 'av-datagrid-cell-active',
                            isInSel && !isEditing && 'av-datagrid-cell-selected',
                            isEditing && 'av-datagrid-cell-editing',
                            editable && 'av-datagrid-cell-editable',
                            error && 'av-datagrid-cell-error',
                            col.pinned && `av-datagrid-cell-pinned-${col.pinned}`,
                          )}
                          style={{ textAlign: col.align }}
                          aria-invalid={!!error}
                          onClick={() => {
                            setActiveCell({ row: ri, col: ci });
                            setSelectionRange(null);
                          }}
                          onDoubleClick={() => {
                            if (!editable) return;
                            setActiveCell({ row: ri, col: ci });
                            setEditingCell({ row: ri, col: ci });
                          }}
                          title={error}
                        >
                          {isEditing && editable ? (
                            <CellEditor
                              value={row[col.key]}
                              col={col}
                              onCommit={(val) => {
                                commitCell(ri, col.key, val);
                                setEditingCell(null);
                              }}
                              onCancel={() => setEditingCell(null)}
                              onTab={(shift) => navigate(0, shift ? -1 : 1)}
                            />
                          ) : col.render ? (
                            col.render(row[col.key], row, ri)
                          ) : (
                            <span className="av-datagrid-cell-value">
                              {displayValue(row[col.key], col)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="av-data-table-footer">
          <span className="av-data-table-count">
            {Math.min((page - 1) * pageSize + 1, sorted.length)}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <nav aria-label="Grid pagination">
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
