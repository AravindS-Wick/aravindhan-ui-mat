import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cls } from './types';

export interface ContextMenuProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, content, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <>
      <div ref={wrapperRef} onContextMenu={handleContextMenu} className="av-context-menu-wrapper" style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        {children}
      </div>
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={cls('av-context-menu', className)}
          style={{ top: position.y, left: position.x }}
          role="menu"
          aria-orientation="vertical"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
  inset?: boolean;
  shortcut?: string;
  icon?: React.ReactNode;
}

export const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, children, disabled, inset, shortcut, icon, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menuitem"
        aria-disabled={disabled}
        className={cls(
          'av-context-menu__item',
          disabled && 'av-context-menu__item--disabled',
          inset && 'av-context-menu__item--inset',
          className
        )}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
        }}
        {...props}
      >
        {icon && <span className="av-context-menu__icon">{icon}</span>}
        {children}
        {shortcut && <span className="av-context-menu__shortcut">{shortcut}</span>}
      </div>
    );
  }
);
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} role="separator" className={cls('av-context-menu__separator', className)} {...props} />;
  }
);
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export const ContextMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cls('av-context-menu__label', className)} {...props} />;
  }
);
ContextMenuLabel.displayName = 'ContextMenuLabel';
