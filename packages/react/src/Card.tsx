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
  /** Renders the card with a bordered style instead of shadow. */
  bordered?: boolean;
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
  bordered = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const computed = cls(
    'av-card',
    flush && 'av-card-flush',
    hoverable && 'av-card-hoverable',
    bordered && 'av-card-bordered',
    className,
  );

  return (
    <div className={computed} {...props}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </div>
  );
}
