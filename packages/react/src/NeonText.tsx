import React from 'react';
import { cls } from './types';

export interface NeonTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: string;
  flicker?: boolean;
}

export const NeonText = React.forwardRef<HTMLHeadingElement, NeonTextProps>(
  ({ children, color = '#3b82f6', flicker = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref as any}
        className={cls("av-neon-text", flicker && "av-neon-text--flicker", className)}
        style={{ '--neon-color': color } as React.CSSProperties}
        {...props as any}
      >
        {children}
      </div>
    );
  }
);
NeonText.displayName = 'NeonText';
