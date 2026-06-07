import React, { useState, useRef, useEffect } from 'react';
import { cls } from './types';

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={cls('av-navigation-menu', className)} {...props}>
        {children}
      </nav>
    );
  }
);
NavigationMenu.displayName = 'NavigationMenu';

export interface NavigationMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

export const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul ref={ref} className={cls('av-navigation-menu__list', className)} {...props}>
        {children}
      </ul>
    );
  }
);
NavigationMenuList.displayName = 'NavigationMenuList';

export interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cls('av-navigation-menu__item', className)} {...props}>
        {children}
      </li>
    );
  }
);
NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOpen?: boolean;
}

export const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, isOpen, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cls('av-navigation-menu__trigger', className)}
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    );
  }
);
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  layout?: 'default' | 'grid';
}

export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, children, isOpen, layout = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cls(
          'av-navigation-menu__content',
          layout === 'grid' && 'av-navigation-menu__content--grid',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavigationMenuContent.displayName = 'NavigationMenuContent';

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, children, title, description, ...props }, ref) => {
    return (
      <a ref={ref} className={cls('av-navigation-menu__link', className)} {...props}>
        {title && <span className="av-navigation-menu__link-title">{title}</span>}
        {description && <span className="av-navigation-menu__link-desc">{description}</span>}
        {children && !title && !description ? children : null}
      </a>
    );
  }
);
NavigationMenuLink.displayName = 'NavigationMenuLink';
