import React, { useRef, useState, MouseEvent } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cls } from './types';

export interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  strength?: number;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, strength = 40, ...props }, ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const localRef = useRef<HTMLButtonElement>(null);

    const handleMouse = (e: MouseEvent<HTMLButtonElement>) => {
      const targetRef = (ref as any)?.current || localRef.current;
      if (!targetRef) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = targetRef.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: (middleX * strength) / width, y: (middleY * strength) / height });
    };

    const reset = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.button
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
          (localRef as any).current = node;
        }}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className={cls("av-magnetic-button", className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';
