import React, { useState, useRef, MouseEvent } from 'react';
import { cls } from './types';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  perspective?: number;
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  ({ children, className, max = 15, perspective = 1000, ...props }, ref) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const localRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const targetRef = (ref as any)?.current || localRef.current;
      if (!targetRef) return;
      const rect = targetRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateXValue = ((y - centerY) / centerY) * -max;
      const rotateYValue = ((x - centerX) / centerX) * max;
      
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
          (localRef as any).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cls("av-tilt-card", className)}
        style={{
          transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TiltCard.displayName = 'TiltCard';
