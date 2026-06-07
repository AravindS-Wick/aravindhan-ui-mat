import React, { useState, useRef } from 'react';
import { cls } from './types';

export interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

export const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, trigger, children, openDelay = 200, closeDelay = 300, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleMouseEnter = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsOpen(true), openDelay);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsOpen(false), closeDelay);
    };

    return (
      <div
        ref={ref}
        className={cls('av-hover-card', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        <div className="av-hover-card__trigger">{trigger}</div>
        <div className="av-hover-card__content">
          {children}
        </div>
      </div>
    );
  }
);
HoverCard.displayName = 'HoverCard';
