import type { HTMLAttributes } from 'react';
import { cls, type ColorScheme, type Size } from './types';

export interface ProgressBarProps {
  /** Value 0–100. */
  value: number;
  /** Color variant. */
  variant?: ColorScheme;
  /** Striped pattern. */
  striped?: boolean;
  /** Animated stripes. */
  animated?: boolean;
  /** Label shown inside the bar. */
  label?: string;
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Value 0–100 (single bar shorthand). */
  value?: number;
  /** Color variant (single bar shorthand). */
  variant?: ColorScheme;
  /** Striped (single bar shorthand). */
  striped?: boolean;
  /** Animated (single bar shorthand). */
  animated?: boolean;
  /** Height size. */
  size?: Size;
  /** Stacked bars — pass multiple ProgressBar children. */
  stacked?: boolean;
}

export function ProgressBar({
  value,
  variant = 'primary',
  striped = false,
  animated = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cls(
        'av-progress-bar',
        `av-progress-bar-${variant}`,
        striped && 'av-progress-bar-striped',
        animated && 'av-progress-bar-animated',
      )}
      role="progressbar"
      style={{ width: `${clamped}%` }}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {label && <span className="av-progress-label">{label}</span>}
    </div>
  );
}

export function Progress({
  value = 0,
  variant = 'primary',
  striped = false,
  animated = false,
  size,
  stacked = false,
  className = '',
  children,
  ...props
}: ProgressProps) {
  return (
    <div
      className={cls('av-progress', size && `av-progress-${size}`, stacked && 'av-progress-stacked', className)}
      {...props}
    >
      {stacked ? (
        children
      ) : (
        <ProgressBar value={value} variant={variant} striped={striped} animated={animated} />
      )}
    </div>
  );
}
