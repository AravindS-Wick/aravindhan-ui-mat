import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cls, type Placement, type Size } from './types';
import { useFocusTrap } from './hooks/useFocusTrap';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: Placement;
  size?: Size;
  title?: ReactNode;
  footer?: ReactNode;
  staticBackdrop?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  children?: ReactNode;
  /** Transition duration in ms. Defaults to 250. */
  transitionDuration?: number;
}

export function Drawer({
  open,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  footer,
  staticBackdrop = false,
  hideCloseButton = false,
  className = '',
  children,
  transitionDuration = 250,
}: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), transitionDuration);
      return () => clearTimeout(t);
    }
  }, [open, transitionDuration]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !staticBackdrop) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, staticBackdrop]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cls('av-drawer-backdrop', visible && 'av-drawer-backdrop-show')}
      role="presentation"
      onClick={(e) => { if (!staticBackdrop && e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={trapRef}
        className={cls(
          'av-drawer',
          `av-drawer-${placement}`,
          size !== 'md' && `av-drawer-${size}`,
          visible && 'av-drawer-open',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'av-drawer-title' : undefined}
      >
        {title && (
          <div className="av-drawer-header">
            <h5 className="av-drawer-title" id="av-drawer-title">{title}</h5>
            {!hideCloseButton && (
              <button type="button" className="av-drawer-close" aria-label="Close drawer" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <div className="av-drawer-body">{children}</div>
        {footer && <div className="av-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
