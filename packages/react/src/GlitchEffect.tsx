import React from 'react';
import { cls } from './types';

export interface GlitchEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const GlitchEffect = React.forwardRef<HTMLDivElement, GlitchEffectProps>(
  ({ text, className, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cls("av-glitch-effect", className)} 
        data-text={text} 
        {...props}
      >
        {text}
      </div>
    );
  }
);
GlitchEffect.displayName = 'GlitchEffect';
