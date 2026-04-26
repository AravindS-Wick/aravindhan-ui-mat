import { useState, useCallback } from 'react';

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  onOpenChange: (v: boolean) => void;
}

/**
 * Manages a boolean open/close state for modals, drawers, dropdowns, etc.
 *
 * @example
 * const { isOpen, open, close } = useDisclosure();
 * <Button onClick={open}>Open Modal</Button>
 * <Modal open={isOpen} onClose={close} />
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const onOpenChange = useCallback((v: boolean) => setIsOpen(v), []);

  return { isOpen, open, close, toggle, onOpenChange };
}
