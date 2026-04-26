import {
  useState, useEffect, useRef,
  type HTMLAttributes, type ReactNode, type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cls } from './types';

export type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface PopoverProps {
  /** The element that triggers the popover. */
  trigger: ReactNode;
  /** Popover content. */
  content: ReactNode;
  /** Open/close trigger. Defaults to `'click'`. */
  triggerOn?: 'click' | 'hover' | 'focus';
  /** Placement. Defaults to `'bottom'`. */
  placement?: PopoverPlacement;
  /** Controlled open state. */
  open?: boolean;
  /** Called when open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Show arrow. */
  arrow?: boolean;
  /** Close when clicking outside. */
  closeOnOutsideClick?: boolean;
  /** Close on Escape key. */
  closeOnEscape?: boolean;
  /** Offset from trigger in px. Defaults to 8. */
  offset?: number;
  className?: string;
}

export function Popover({
  trigger,
  content,
  triggerOn = 'click',
  placement = 'bottom',
  open: controlledOpen,
  onOpenChange,
  arrow = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  offset = 8,
  className = '',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

  function setOpen(v: boolean) {
    setInternalOpen(v);
    onOpenChange?.(v);
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, closeOnOutsideClick]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeOnEscape]);

  // Position calculation
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return;

    const tr = triggerRef.current.getBoundingClientRect();
    const pr = popoverRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0, left = 0;
    const [side, align = 'center'] = placement.split('-');

    switch (side) {
      case 'bottom': top = tr.bottom + scrollY + offset; break;
      case 'top':    top = tr.top + scrollY - pr.height - offset; break;
      case 'left':   left = tr.left + scrollX - pr.width - offset; top = tr.top + scrollY; break;
      case 'right':  left = tr.right + scrollX + offset; top = tr.top + scrollY; break;
    }

    if (side === 'bottom' || side === 'top') {
      if (align === 'start' || align === 'center') left = tr.left + scrollX;
      if (align === 'end') left = tr.right + scrollX - pr.width;
      if (align === 'center') left = tr.left + scrollX + tr.width / 2 - pr.width / 2;
    } else {
      if (align === 'start') { /* use computed top */ }
      if (align === 'end') top = tr.bottom + scrollY - pr.height;
      if (!align || align === 'center') top = tr.top + scrollY + tr.height / 2 - pr.height / 2;
    }

    setStyle({ position: 'absolute', top, left, zIndex: 1050 });
  }, [isOpen, placement, offset]);

  const triggerProps = triggerOn === 'click'
    ? { onClick: () => setOpen(!isOpen) }
    : triggerOn === 'hover'
    ? {
        onMouseEnter: () => { clearTimeout(hoverTimer.current); setOpen(true); },
        onMouseLeave: () => { hoverTimer.current = setTimeout(() => setOpen(false), 100); },
      }
    : {
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      };

  return (
    <>
      <div ref={triggerRef} className="av-popover-trigger" {...triggerProps} style={{ display: 'inline-block' }}>
        {trigger}
      </div>
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          className={cls('av-popover', `av-popover-${placement.split('-')[0]}`, arrow && 'av-popover-arrow', className)}
          style={style}
          role="dialog"
          aria-modal="false"
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
}
