import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cls, type ColorScheme, type ToastPosition } from './types';

export interface ToastItem {
  id: string;
  title?: ReactNode;
  message: ReactNode;
  variant?: ColorScheme;
  /** Alias for variant. */
  type?: ColorScheme;
  duration?: number;
  dismissible?: boolean;
  icon?: ReactNode;
}

export interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastItem({ item, onDismiss }: ToastProps) {
  useEffect(() => {
    if (item.duration === 0) return;
    const t = setTimeout(() => onDismiss(item.id), item.duration ?? 4000);
    return () => clearTimeout(t);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      className={cls('av-toast', (item.variant ?? item.type) && `av-toast-${item.variant ?? item.type}`)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {item.icon && <span className="av-toast-icon">{item.icon}</span>}
      <div className="av-toast-body">
        {item.title && <div className="av-toast-title">{item.title}</div>}
        <div className="av-toast-message">{item.message}</div>
      </div>
      {item.dismissible !== false && (
        <button
          type="button"
          className="av-toast-dismiss"
          aria-label="Dismiss"
          onClick={() => onDismiss(item.id)}
        >
          &times;
        </button>
      )}
    </div>
  );
}

export interface ToastContainerProps {
  /** Where to render toasts. Defaults to `'top-right'`. */
  position?: ToastPosition;
  /** Max toasts visible simultaneously. Defaults to 5. */
  maxVisible?: number;
}

let _listeners: Array<(item: ToastItem) => void> = [];

export const toast = {
  show(item: Omit<ToastItem, 'id'> & { id?: string }) {
    const full: ToastItem = { id: typeof crypto !== 'undefined' ? crypto.randomUUID() : String(Date.now()), ...item };
    _listeners.forEach((fn) => fn(full));
    return full.id;
  },
  success(message: ReactNode, opts?: Partial<ToastItem>) {
    return toast.show({ message, variant: 'success', ...opts });
  },
  error(message: ReactNode, opts?: Partial<ToastItem>) {
    return toast.show({ message, variant: 'danger', ...opts });
  },
  warning(message: ReactNode, opts?: Partial<ToastItem>) {
    return toast.show({ message, variant: 'warning', ...opts });
  },
  info(message: ReactNode, opts?: Partial<ToastItem>) {
    return toast.show({ message, variant: 'info', ...opts });
  },
};

export function ToastContainer({ position = 'top-right', maxVisible = 5 }: ToastContainerProps) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (item: ToastItem) => {
      setItems((prev) => {
        const next = [item, ...prev];
        return next.slice(0, maxVisible);
      });
    };
    _listeners.push(handler);
    return () => { _listeners = _listeners.filter((fn) => fn !== handler); };
  }, [maxVisible]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={cls('av-toast-container', `av-toast-container-${position}`)}>
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>,
    document.body,
  );
}
