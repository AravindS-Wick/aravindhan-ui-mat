import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration or icon. */
  illustration?: ReactNode;
  /** Main title. */
  title: ReactNode;
  /** Descriptive text. */
  description?: ReactNode;
  /** Primary action button/link. */
  action?: ReactNode;
  /** Secondary action. */
  secondaryAction?: ReactNode;
  /** Size variant. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cls('av-empty-state', size !== 'md' && `av-empty-state-${size}`, className)}
      role="status"
      {...props}
    >
      {illustration && <div className="av-empty-state-illustration">{illustration}</div>}
      <div className="av-empty-state-title">{title}</div>
      {description && <div className="av-empty-state-description">{description}</div>}
      {(action || secondaryAction) && (
        <div className="av-empty-state-actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
