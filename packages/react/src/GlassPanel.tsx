import React from 'react';
import { cls } from './types';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, blur = 'md', intensity = 'medium', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cls(
          "av-glass-panel",
          `av-glass-panel--blur-${blur}`,
          `av-glass-panel--intensity-${intensity}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = 'GlassPanel';
