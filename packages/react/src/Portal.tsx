import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /** Target DOM element. Defaults to `document.body`. */
  container?: Element | null;
  children: ReactNode;
}

export function Portal({ container, children }: PortalProps) {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;
  return createPortal(children, target);
}
