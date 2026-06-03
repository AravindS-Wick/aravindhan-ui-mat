import React from 'react';
import { cls } from './types';

export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  variant?: 'primary' | 'success' | 'danger' | 'warning';
}

export const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ className, data, variant = 'primary', ...props }, ref) => {
    const max = Math.max(...data, 1); // Avoid division by 0

    return (
      <div ref={ref} className={cls('av-sparkline', className)} {...props}>
        {data.map((value, idx) => (
          <div
            key={idx}
            className="av-sparkline__bar"
            data-variant={variant}
            style={{ height: `${(value / max) * 100}%` }}
            title={`${value}`}
          />
        ))}
      </div>
    );
  }
);
Sparkline.displayName = 'Sparkline';
