/**
 * Shared prop types for all @aravi1008/ui-react components.
 * These map directly to av- CSS class suffixes in @aravi1008/ui.
 */

export type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Build a space-joined class string, filtering falsy values. */
export function cls(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
