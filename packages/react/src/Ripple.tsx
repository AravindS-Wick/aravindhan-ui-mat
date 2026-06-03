import React, { useState, MouseEvent } from 'react';
import { cls } from './types';

export interface RippleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  duration?: number;
}

export const Ripple = React.forwardRef<HTMLDivElement, RippleProps>(
  ({ children, className, color = 'rgba(255, 255, 255, 0.3)', duration = 600, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const addRipple = (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples((prev) => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, duration);
      
      if (props.onMouseDown) props.onMouseDown(e);
    };

    return (
      <div 
        ref={ref}
        className={cls("av-ripple", className)} 
        onMouseDown={addRipple} 
        style={{ '--duration': `${duration}ms` } as React.CSSProperties}
        {...props}
      >
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="av-ripple__span"
            style={{
              left: r.x,
              top: r.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    );
  }
);
Ripple.displayName = 'Ripple';
