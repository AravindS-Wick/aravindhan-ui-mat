import type { HTMLAttributes } from 'react';
import { cls } from './types';

export interface CurrencyProps extends HTMLAttributes<HTMLSpanElement> {
  /** The numeric value to format. */
  value: number;
  /** ISO 4217 currency code (e.g., 'USD', 'EUR', 'INR'). Defaults to 'USD'. */
  currency?: string;
  /** BCP 47 language tag for locale (e.g., 'en-US', 'en-IN'). Defaults to 'en-US'. */
  locale?: string;
  /** If true, uses compact notation (e.g., $1.2M instead of $1,200,000). */
  compact?: boolean;
  /** Controls how the sign is displayed. */
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
  /** Minimum number of fraction digits to display. */
  minimumFractionDigits?: number;
  /** Maximum number of fraction digits to display. */
  maximumFractionDigits?: number;
}

export function Currency({
  value,
  currency = 'USD',
  locale = 'en-US',
  compact = false,
  signDisplay = 'auto',
  minimumFractionDigits,
  maximumFractionDigits,
  className,
  ...props
}: CurrencyProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    signDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return (
    <span className={cls('av-currency', className)} {...props}>
      {formatter.format(value)}
    </span>
  );
}
