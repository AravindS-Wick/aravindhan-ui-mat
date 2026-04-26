import type { SVGAttributes } from 'react';
import { cls } from './types';

/** All 221 icon names from @aravi1008/ui icon set. */
export type IconName =
  // Navigation & Arrows
  | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up'
  | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'chevron-up'
  | 'rotate-ccw' | 'rotate-cw' | 'navigation' | 'compass' | 'home'
  | 'menu' | 'more-horizontal' | 'more-vertical' | 'sidebar'
  // Actions
  | 'check' | 'check-square' | 'circle-check' | 'circle-x'
  | 'close' | 'minus' | 'plus' | 'edit' | 'trash' | 'copy'
  | 'download' | 'upload' | 'share' | 'link' | 'link-off' | 'external-link'
  | 'filter' | 'search' | 'settings' | 'sort' | 'refresh'
  | 'zoom-in' | 'zoom-out' | 'maximize' | 'minimize'
  // Clock & Time
  | 'clock' | 'clock-1' | 'clock-2' | 'clock-3' | 'clock-4' | 'clock-5'
  | 'clock-6' | 'clock-7' | 'clock-8' | 'clock-9' | 'clock-10' | 'clock-11' | 'clock-12'
  | 'clock-countdown' | 'clock-deadline' | 'clock-face' | 'hourglass' | 'timer'
  | 'alarm' | 'calendar'
  // Status & Feedback
  | 'info' | 'warning' | 'shield' | 'shield-check' | 'lock' | 'unlock'
  | 'eye' | 'eye-off' | 'loader' | 'star' | 'heart' | 'thumbs-up' | 'thumbs-down'
  | 'award' | 'flag' | 'bookmark' | 'tag'
  // Communication
  | 'mail' | 'send' | 'message' | 'message-circle' | 'inbox'
  | 'phone' | 'bell' | 'bell-off'
  // Media
  | 'play' | 'pause' | 'stop' | 'skip-back' | 'skip-forward'
  | 'volume' | 'volume-off' | 'mic' | 'mic-off'
  | 'camera' | 'video' | 'video-off' | 'image' | 'file-image'
  // Files & Folders
  | 'file' | 'file-text' | 'folder' | 'folder-open'
  | 'archive' | 'package' | 'paperclip' | 'printer'
  // People
  | 'user' | 'user-plus' | 'user-minus' | 'users'
  // Data & Charts
  | 'bar-chart' | 'bar-chart-2' | 'pie-chart' | 'trending-up' | 'trending-down'
  | 'database' | 'server' | 'layers' | 'grid' | 'columns' | 'layout' | 'list'
  // Devices
  | 'monitor' | 'smartphone' | 'tablet' | 'laptop' | 'cpu'
  | 'wifi' | 'wifi-off' | 'bluetooth' | 'battery' | 'globe'
  | 'map' | 'map-pin' | 'moon' | 'sun'
  // Commerce
  | 'shopping-cart' | 'credit-card' | 'truck' | 'gift' | 'key'
  // Dev / Tech logos
  | 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'slack'
  | 'react' | 'vue' | 'angular' | 'svelte' | 'nextjs' | 'nuxt' | 'remix' | 'astro' | 'gatsby'
  | 'typescript' | 'javascript' | 'python' | 'java' | 'kotlin' | 'swift' | 'ruby' | 'rust' | 'go' | 'php' | 'dart' | 'flutter'
  | 'nodejs' | 'vite' | 'webpack' | 'rollup' | 'esbuild' | 'tailwind' | 'graphql' | 'prisma'
  | 'docker' | 'kubernetes' | 'aws' | 'azure' | 'gcp' | 'vercel' | 'netlify' | 'supabase' | 'firebase'
  | 'mongodb' | 'postgresql' | 'redis' | 'jest' | 'cypress' | 'cucumber'
  | 'figma' | 'notion' | 'vscode' | 'storybook' | 'windsurf' | 'copilot' | 'openai' | 'gemini' | 'claude'
  // Misc
  | 'activity' | 'anchor' | 'aperture' | 'at-sign' | 'box' | 'briefcase'
  | 'cast' | 'cloud' | 'cloud-download' | 'cloud-upload' | 'code'
  | 'crop' | 'cursor' | 'disc' | 'drag' | 'globe' | 'laptop'
  | 'phone' | 'send' | 'terminal';

export interface IconProps extends SVGAttributes<SVGElement> {
  /** Icon name from @aravi1008/ui icon set. */
  name: IconName;
  /** Size in px. Defaults to 24. */
  size?: number;
  /** Stroke width. Defaults to 2. */
  strokeWidth?: number;
  /** Accessible label. Omit for decorative icons. */
  label?: string;
  /** URL to the SVG sprite. Defaults to /icons/sprite.svg. */
  spriteUrl?: string;
}

export function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  label,
  spriteUrl = '/icons/sprite.svg',
  className = '',
  style,
  ...props
}: IconProps) {
  return (
    <svg
      className={cls('av-icon', `av-icon-${name}`, className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      style={style}
      {...props}
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
}
