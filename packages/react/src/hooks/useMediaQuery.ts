import { useState, useEffect } from 'react';

/** Predefined breakpoints matching @aravi1008/ui breakpoints. */
export const breakpoints = {
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  '2xl': '(min-width: 1400px)',
  dark: '(prefers-color-scheme: dark)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  touch: '(hover: none) and (pointer: coarse)',
} as const;

/**
 * Returns `true` when the media query matches.
 *
 * @example
 * const isDesktop = useMediaQuery(breakpoints.lg);
 * const isDark = useMediaQuery(breakpoints.dark);
 * const isCustom = useMediaQuery('(max-width: 600px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
