import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cls } from './types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, children, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={cls('av-command-palette', className)}>
      <div className="av-command-palette__backdrop" onClick={onClose} />
      <div className="av-command-palette__content" role="dialog" aria-modal="true">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CommandPaletteInput) {
            return React.cloneElement(child, { ref: inputRef } as any);
          }
          return child;
        })}
      </div>
    </div>,
    document.body
  );
};

export const CommandPaletteInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="av-command-palette__header">
        <svg className="av-command-palette__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={ref}
          className={cls('av-command-palette__input', className)}
          placeholder="Type a command or search..."
          {...props}
        />
      </div>
    );
  }
);
CommandPaletteInput.displayName = 'CommandPaletteInput';

export const CommandPaletteBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cls('av-command-palette__body', className)} {...props}>
      {children}
    </div>
  );
};

export const CommandPaletteGroup: React.FC<React.HTMLAttributes<HTMLDivElement> & { title: string }> = ({ className, title, children, ...props }) => {
  return (
    <div className={className} {...props}>
      <div className="av-command-palette__group-title">{title}</div>
      {children}
    </div>
  );
};

export interface CommandPaletteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  shortcut?: string[];
}

export const CommandPaletteItem: React.FC<CommandPaletteItemProps> = ({ className, selected, icon, shortcut, children, ...props }) => {
  return (
    <div className={cls('av-command-palette__item', className)} data-selected={selected} {...props}>
      {icon}
      <span className="av-command-palette__item-title">{children}</span>
      {shortcut && (
        <span className="av-command-palette__shortcut">
          {shortcut.map((key, i) => <kbd key={i}>{key}</kbd>)}
        </span>
      )}
    </div>
  );
};
