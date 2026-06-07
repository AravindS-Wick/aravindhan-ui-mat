import React, { useCallback } from 'react';
import canvasConfetti from 'canvas-confetti';
import { cls } from './types';

export interface ConfettiProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export const Confetti = React.forwardRef<HTMLButtonElement, ConfettiProps>(
  ({ children, className, particleCount = 100, spread = 70, origin = { x: 0.5, y: 0.5 }, onClick, ...props }, ref) => {
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        canvasConfetti({
          particleCount,
          spread,
          origin,
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        });
        if (onClick) onClick(e);
      },
      [onClick, particleCount, spread, origin]
    );

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cls("av-confetti", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Confetti.displayName = 'Confetti';
