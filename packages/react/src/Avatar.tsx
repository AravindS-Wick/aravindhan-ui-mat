import type { HTMLAttributes } from 'react';
import { cls, type Size, type ColorScheme } from './types';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. */
  src?: string;
  /** Alt text when src is provided. */
  alt?: string;
  /** Initials to display when no src. */
  initials?: string;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
  /** Background color variant (used with initials). */
  color?: ColorScheme;
  /** Renders as a circle (default) vs rounded square. */
  shape?: 'circle' | 'square';
  /** Online/offline/busy/away status indicator. */
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  color = 'primary',
  shape = 'circle',
  status,
  className = '',
  ...props
}: AvatarProps) {
  const computed = cls(
    'av-avatar',
    size !== 'md' && `av-avatar-${size}`,
    shape === 'square' && 'av-avatar-square',
    !src && `av-avatar-${color}`,
    className,
  );

  return (
    <span className={computed} {...props}>
      {src ? (
        <img src={src} alt={alt} className="av-avatar-img" />
      ) : (
        <span className="av-avatar-initials" aria-label={alt || initials}>
          {initials}
        </span>
      )}
      {status && <span className={`av-avatar-status av-avatar-status-${status}`} aria-label={status} />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Max avatars to show before +N overflow. */
  max?: number;
}

export function AvatarGroup({ max, className = '', children, ...props }: AvatarGroupProps) {
  return (
    <div className={cls('av-avatar-group', className)} data-av-max={max} {...props}>
      {children}
    </div>
  );
}
