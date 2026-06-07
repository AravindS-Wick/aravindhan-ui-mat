import React from 'react';
import { cls } from './types';

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cls('av-bottom-navigation', className)} {...props}>
        {children}
      </div>
    );
  }
);
BottomNavigation.displayName = 'BottomNavigation';

export interface BottomNavigationActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export const BottomNavigationAction = React.forwardRef<HTMLButtonElement, BottomNavigationActionProps>(
  ({ className, icon, label, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cls('av-bottom-navigation__item', className)}
        data-active={active}
        aria-pressed={active}
        {...props}
      >
        {icon}
        <span className="av-bottom-navigation__label">{label}</span>
      </button>
    );
  }
);
BottomNavigationAction.displayName = 'BottomNavigationAction';
