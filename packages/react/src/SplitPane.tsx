import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface SplitPaneProps extends HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}
export function SplitPane({ className = '', vertical, children, ...props }: SplitPaneProps) {
  return (
    <div className={cls('av-split-pane', vertical && 'av-split-pane--vertical', className)} {...props}>
      {children}
    </div>
  );
}

export interface SplitPanePaneProps extends HTMLAttributes<HTMLDivElement> {}
export function SplitPanePane({ className = '', children, ...props }: SplitPanePaneProps) {
  return (
    <div className={cls('av-split-pane__pane', className)} {...props}>
      {children}
    </div>
  );
}

export interface SplitPaneResizerProps extends HTMLAttributes<HTMLDivElement> {}
export function SplitPaneResizer({ className = '', ...props }: SplitPaneResizerProps) {
  return <div className={cls('av-split-pane__resizer', className)} {...props} />;
}
