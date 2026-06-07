import React, { useState } from 'react';
import { cls } from './types';

export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  icon?: React.ReactNode;
  openIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  ({ className, direction = 'up', position = 'bottom-right', icon, openIcon, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultIcon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cls(
          'av-speed-dial',
          `av-speed-dial--${position}`,
          `av-speed-dial--${direction}`,
          className
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      >
        <div className="av-speed-dial__actions" data-state={isOpen ? 'open' : 'closed'}>
          {children}
        </div>
        <button
          className="av-speed-dial__trigger"
          data-state={isOpen ? 'open' : 'closed'}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle speed dial"
        >
          {isOpen && openIcon ? openIcon : (icon || defaultIcon)}
        </button>
      </div>
    );
  }
);
SpeedDial.displayName = 'SpeedDial';

export interface SpeedDialActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltipTitle: string;
}

export const SpeedDialAction = React.forwardRef<HTMLButtonElement, SpeedDialActionProps>(
  ({ className, icon, tooltipTitle, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cls('av-speed-dial__action', className)}
        aria-label={tooltipTitle}
        title={tooltipTitle}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
SpeedDialAction.displayName = 'SpeedDialAction';
