import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cls } from './types';

export interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={cls('av-action-sheet', className)}>
      <div className="av-action-sheet__backdrop" onClick={onClose} />
      <div className="av-action-sheet__content" role="dialog" aria-modal="true">
        <div className="av-action-sheet__handle" />
        <div className="av-action-sheet__body">{children}</div>
      </div>
    </div>,
    document.body
  );
};
