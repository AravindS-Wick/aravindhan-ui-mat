import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  mobileToggled?: boolean;
}

export function AppShell({ className = '', mobileToggled, children, ...props }: AppShellProps) {
  return (
    <div className={cls('av-app-shell', mobileToggled && 'av-app-shell--mobile-toggled', className)} {...props}>
      {children}
    </div>
  );
}

export interface AppShellHeaderProps extends HTMLAttributes<HTMLHeadElement> {}
export function AppShellHeader({ className = '', children, ...props }: AppShellHeaderProps) {
  return <header className={cls('av-app-shell__header', className)} {...props}>{children}</header>;
}

export interface AppShellSidebarProps extends HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  mobileOpen?: boolean;
}
export function AppShellSidebar({ className = '', collapsed, mobileOpen, children, ...props }: AppShellSidebarProps) {
  return (
    <aside className={cls('av-app-shell__sidebar', collapsed && 'av-app-shell__sidebar--collapsed', mobileOpen && 'av-app-shell__sidebar--mobile-open', className)} {...props}>
      {children}
    </aside>
  );
}

export interface AppShellMainProps extends HTMLAttributes<HTMLDivElement> {}
export function AppShellMain({ className = '', children, ...props }: AppShellMainProps) {
  return <main className={cls('av-app-shell__main', className)} {...props}>{children}</main>;
}

export interface AppShellFooterProps extends HTMLAttributes<HTMLElement> {}
export function AppShellFooter({ className = '', children, ...props }: AppShellFooterProps) {
  return <footer className={cls('av-app-shell__footer', className)} {...props}>{children}</footer>;
}
