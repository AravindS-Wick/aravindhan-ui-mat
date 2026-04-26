import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cls, type Size } from './types';
import { useFocusTrap } from './hooks/useFocusTrap';
import type React from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  size?: Size;
  staticBackdrop?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
  /** Transition duration in ms. Defaults to 200. */
  transitionDuration?: number;
}

export function Modal({
  open,
  onClose,
  title,
  footer,
  size = 'md',
  staticBackdrop = false,
  hideCloseButton = false,
  className = '',
  children,
  'aria-label': ariaLabel,
  transitionDuration = 200,
}: ModalProps) {
  // `mounted` keeps the DOM node alive during exit transition
  const [mounted, setMounted] = useState(open);
  // `visible` drives the CSS entering/leaving class
  const [visible, setVisible] = useState(false);

  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // next tick so the entering class applies after mount
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

  const titleId = title ? 'av-modal-title' : undefined;

  return createPortal(
    <div
      className={cls('av-modal-backdrop', visible && 'av-modal-backdrop-show')}
      onClick={(e) => { if (!staticBackdrop && e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        ref={trapRef}
        className={cls(
          'av-modal-dialog',
          size !== 'md' && `av-modal-${size}`,
          visible && 'av-modal-open',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={!title ? ariaLabel : undefined}
      >
        {title && (
          <div className="av-modal-header">
            <h5 className="av-modal-title" id="av-modal-title">{title}</h5>
            {!hideCloseButton && (
              <button type="button" className="av-modal-close" aria-label="Close modal" onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <div className="av-modal-body">{children}</div>
        {footer && <div className="av-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
