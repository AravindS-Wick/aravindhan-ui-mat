import { useState, useEffect, type ButtonHTMLAttributes } from 'react';
import { cls } from './types';

export type Theme = 'light' | 'dark' | 'forest' | 'ocean' | 'professional' | 'corporate';

const THEMES: Theme[] = ['light', 'dark', 'forest', 'ocean', 'professional', 'corporate'];

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Which themes to cycle through. Defaults to `['light', 'dark']`. */
  themes?: Theme[];
  /** Initial theme. */
  defaultTheme?: Theme;
  /** Controlled theme. */
  theme?: Theme;
  /** Called when theme changes. */
  onThemeChange?: (theme: Theme) => void;
  /** Show theme label. */
  showLabel?: boolean;
}

export function ThemeToggle({
  themes = ['light', 'dark'],
  defaultTheme = 'light',
  theme: controlledTheme,
  onThemeChange,
  showLabel = false,
  className = '',
  ...props
}: ThemeToggleProps) {
  const [internal, setInternal] = useState<Theme>(() => {
    if (typeof document === 'undefined') return defaultTheme;
    return (document.documentElement.getAttribute('data-av-theme') as Theme) ?? defaultTheme;
  });

  const current = controlledTheme ?? internal;

  useEffect(() => {
    document.documentElement.setAttribute('data-av-theme', current);
  }, [current]);

  function cycle() {
    const idx = themes.indexOf(current);
    const next = themes[(idx + 1) % themes.length];
    setInternal(next);
    onThemeChange?.(next);
  }

  const ICONS: Record<string, string> = { light: '☀️', dark: '🌙', forest: '🌲', ocean: '🌊', professional: '💼', corporate: '🏢' };

  return (
    <button
      type="button"
      className={cls('av-theme-toggle', `av-theme-toggle-${current}`, className)}
      onClick={cycle}
      aria-label={`Switch theme (current: ${current})`}
      {...props}
    >
      <span aria-hidden="true">{ICONS[current] ?? '🎨'}</span>
      {showLabel && <span className="av-theme-toggle-label">{current}</span>}
    </button>
  );
}

export { THEMES };
