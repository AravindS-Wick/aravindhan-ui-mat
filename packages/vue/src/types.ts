export type Variant =
  | 'primary' | 'secondary' | 'outline' | 'ghost'
  | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme =
  | 'primary' | 'secondary' | 'success' | 'danger'
  | 'warning' | 'info' | 'light' | 'dark';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export function cls(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
