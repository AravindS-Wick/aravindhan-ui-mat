import { useState, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, type Placement } from './types';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Tooltip text/content. */
  content: ReactNode;
  /** Placement relative to trigger. Defaults to `'top'`. */
  placement?: Placement;
  /** Delay before showing (ms). Defaults to 200. */
  delay?: number;
  /** Disable the tooltip. */
  disabled?: boolean;
}

export function Tooltip({
  content,
  placement = 'top',
  delay = 200,
  disabled = false,
  className = '',
  children,
  ...props
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  function show() {
    if (disabled) return;
    timer.current = setTimeout(() => setVisible(true), delay);
  }

  function hide() {
    clearTimeout(timer.current);
    setVisible(false);
  }

  return (
    <span
      className={cls('av-tooltip-wrapper', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...props}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cls('av-tooltip', `av-tooltip-${placement}`)}
        >
          {content}
        </span>
      )}
    </span>
  );
}
