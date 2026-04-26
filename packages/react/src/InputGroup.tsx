import type { HTMLAttributes, ReactNode } from 'react';
import { cls } from './types';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Content prepended before the input. */
  prepend?: ReactNode;
  /** Content appended after the input. */
  append?: ReactNode;
  /** Makes the group fill its container. */
  fluid?: boolean;
}

export function InputGroup({ prepend, append, fluid, className = '', children, ...props }: InputGroupProps) {
  return (
    <div className={cls('av-input-group', fluid && 'av-input-group-fluid', className)} {...props}>
      {prepend && <span className="av-input-group-text">{prepend}</span>}
      {children}
      {append && <span className="av-input-group-text">{append}</span>}
    </div>
  );
}

export interface InputGroupTextProps extends HTMLAttributes<HTMLSpanElement> {}
export function InputGroupText({ className = '', children, ...props }: InputGroupTextProps) {
  return (
    <span className={cls('av-input-group-text', className)} {...props}>
      {children}
    </span>
  );
}
