import type { HTMLAttributes, ReactNode } from 'react';
import { cls, type ColorScheme } from './types';

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  /** Primary content. */
  content: ReactNode;
  /** Timestamp or metadata. */
  time?: ReactNode;
  /** Title above content. */
  title?: ReactNode;
  /** Custom connector dot/icon. */
  dot?: ReactNode;
  /** Dot color variant. */
  dotColor?: ColorScheme;
}

export function TimelineItem({
  content,
  time,
  title,
  dot,
  dotColor = 'primary',
  className = '',
  ...props
}: TimelineItemProps) {
  return (
    <div className={cls('av-timeline-item', className)} {...props}>
      <div className={cls('av-timeline-dot', `av-timeline-dot-${dotColor}`)}>
        {dot}
      </div>
      <div className="av-timeline-content">
        {time && <time className="av-timeline-time">{time}</time>}
        {title && <div className="av-timeline-title">{title}</div>}
        <div className="av-timeline-body">{content}</div>
      </div>
    </div>
  );
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Alternating left/right layout. */
  alternate?: boolean;
  /** Reverse order (newest first). */
  reverse?: boolean;
}

export function Timeline({ alternate = false, reverse = false, className = '', children, ...props }: TimelineProps) {
  return (
    <div
      className={cls(
        'av-timeline',
        alternate && 'av-timeline-alternate',
        reverse && 'av-timeline-reverse',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
