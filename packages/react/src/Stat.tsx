import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Main metric value. */
  value: ReactNode;
  /** Label under the value. */
  label: ReactNode;
  /** Optional description below label. */
  description?: ReactNode;
  /** Trend indicator: positive/negative percentage or text. */
  trend?: ReactNode;
  /** Trend direction for coloring. */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Icon displayed alongside value. */
  icon?: ReactNode;
  /** Bordered card style. */
  bordered?: boolean;
}

export function Stat({
  value,
  label,
  description,
  trend,
  trendDirection,
  icon,
  bordered = false,
  className = '',
  ...props
}: StatProps) {
  return (
    <div className={cls('av-stat', bordered && 'av-stat-bordered', className)} {...props}>
      {icon && <div className="av-stat-icon">{icon}</div>}
      <div className="av-stat-body">
        <div className="av-stat-value">{value}</div>
        <div className="av-stat-label">{label}</div>
        {description && <div className="av-stat-description">{description}</div>}
        {trend && (
          <div className={cls('av-stat-trend', trendDirection && `av-stat-trend-${trendDirection}`)}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns. Defaults to auto. */
  cols?: 2 | 3 | 4;
}

export function StatGroup({ cols, className = '', children, ...props }: StatGroupProps) {
  return (
    <div className={cls('av-stat-group', cols && `av-stat-group-${cols}`, className)} {...props}>
      {children}
    </div>
  );
}
