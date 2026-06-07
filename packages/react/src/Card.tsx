import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional header content. */
  header?: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
  /** Removes the default padding from the card body. */
  flush?: boolean;
  /** Adds a hover shadow effect. */
  hoverable?: boolean;
  /** The appearance style of the card. */
  appearance?: 'outline' | 'elevated' | 'filled';
  /** The semantic color tint of the card. */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return <div className={cls('av-card-header', className)} {...props}>{children}</div>;
}

export function CardBody({ className = '', children, ...props }: CardBodyProps) {
  return <div className={cls('av-card-body', className)} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return <div className={cls('av-card-footer', className)} {...props}>{children}</div>;
}

export function Card({
  header,
  footer,
  flush = false,
  hoverable = false,
  appearance = 'outline',
  color = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const computed = cls(
    'av-card',
    `av-card-appearance-${appearance}`,
    color !== 'default' && `av-card-color-${color}`,
    flush && 'av-card-flush',
    hoverable && 'av-card-hoverable',
    className,
  );

  return (
    <div className={computed} {...props}>
      {header && (
        typeof header === 'string' || typeof header === 'number' ? 
          <CardHeader>{header}</CardHeader> : header
      )}
      {children}
      {footer && (
        typeof footer === 'string' || typeof footer === 'number' ? 
          <CardFooter>{footer}</CardFooter> : footer
      )}
    </div>
  );
}
