import { useState, type ReactNode, type KeyboardEvent } from 'react';
import { cls } from './types';

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  /** Controlled expanded node ids. */
  expanded?: string[];
  /** Default expanded node ids (uncontrolled). */
  defaultExpanded?: string[];
  onExpandChange?: (ids: string[]) => void;
  /** Controlled selected node id. */
  selected?: string;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Allow multiple selection (ctrl/cmd+click). */
  multiSelect?: boolean;
  /** Show connecting lines. */
  showLines?: boolean;
  className?: string;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  showLines: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, node: TreeNode, multi: boolean) => void;
  multiSelect: boolean;
}

function TreeItem({ node, level, expandedIds, selectedIds, showLines, onToggle, onSelect, multiSelect }: TreeItemProps) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.has(node.id);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.id, node, false); }
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) { e.preventDefault(); onToggle(node.id); }
    if (e.key === 'ArrowLeft' && isExpanded) { e.preventDefault(); onToggle(node.id); }
  };

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={node.disabled}
    >
      <div
        className={cls(
          'av-tree-item',
          isSelected && 'av-tree-item-selected',
          node.disabled && 'av-tree-item-disabled',
          showLines && 'av-tree-item-lined',
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        tabIndex={node.disabled ? -1 : 0}
        onClick={(e) => { if (!node.disabled) onSelect(node.id, node, multiSelect && (e.metaKey || e.ctrlKey)); }}
        onKeyDown={handleKey}
      >
        {hasChildren ? (
          <button
            type="button"
            className="av-tree-toggle"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: isExpanded ? 'rotate(90deg)' : undefined, transition: 'transform 0.15s' }}>
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className="av-tree-spacer" />
        )}
        {node.icon && <span className="av-tree-icon">{node.icon}</span>}
        <span className="av-tree-label">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <ul role="group" className="av-tree-group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedIds={selectedIds}
              showLines={showLines}
              onToggle={onToggle}
              onSelect={onSelect}
              multiSelect={multiSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  nodes,
  expanded: controlledExpanded,
  defaultExpanded = [],
  onExpandChange,
  selected: controlledSelected,
  onSelect,
  multiSelect = false,
  showLines = false,
  className = '',
}: TreeViewProps) {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());

  const expandedIds = controlledExpanded ? new Set(controlledExpanded) : internalExpanded;
  const selectedIds = controlledSelected ? new Set([controlledSelected]) : internalSelected;

  const handleToggle = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    if (!controlledExpanded) setInternalExpanded(next);
    onExpandChange?.([...next]);
  };

  const handleSelect = (id: string, node: TreeNode, multi: boolean) => {
    let next: Set<string>;
    if (multi && multiSelect) {
      next = new Set(selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
    } else {
      next = new Set([id]);
    }
    if (!controlledSelected) setInternalSelected(next);
    onSelect?.(id, node);
  };

  return (
    <ul
      role="tree"
      className={cls('av-tree', showLines && 'av-tree-lined', className)}
    >
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          showLines={showLines}
          onToggle={handleToggle}
          onSelect={handleSelect}
          multiSelect={multiSelect}
        />
      ))}
    </ul>
  );
}
