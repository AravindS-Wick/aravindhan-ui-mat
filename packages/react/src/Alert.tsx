import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The semantic color tint of the alert. Defaults to `'info'`. */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** The visual appearance of the alert. Defaults to `'soft'`. */
  appearance?: 'soft' | 'solid' | 'outline' | 'left-accent';
  /** Optional title rendered above the message. */
  title?: ReactNode;
  /** Whether the alert can be dismissed (renders an × button). */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void;
  /** Icon rendered on the left side. */
  icon?: ReactNode;
}

export function Alert({
  color = 'info',
  appearance = 'soft',
  title,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
  children,
  ...props
}: AlertProps) {
  const computed = cls(
    'av-alert',
    `av-alert-appearance-${appearance}`,
    `av-alert-color-${color}`,
    className
  );

  return (
    <div className={computed} role="alert" {...props}>
      {icon && <span className="av-alert-icon">{icon}</span>}
      <div className="av-alert-body">
        {title && <div className="av-alert-title">{title}</div>}
        {children && <div className="av-alert-message">{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          className="av-alert-dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
    </div>
  );
}
