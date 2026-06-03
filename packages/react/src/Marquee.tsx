import React from 'react';
import { cls } from './types';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ className, reverse, pauseOnHover = false, children, vertical = false, repeat = 4, duration = "40s", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cls(
          "av-marquee",
          vertical ? "av-marquee--vertical" : "av-marquee--horizontal",
          reverse && "av-marquee--reverse",
          pauseOnHover && "av-marquee--pause-on-hover",
          className
        )}
        style={{ '--duration': duration } as React.CSSProperties}
        {...props}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="av-marquee__track">
              {children}
            </div>
          ))}
      </div>
    );
  }
);
Marquee.displayName = 'Marquee';
