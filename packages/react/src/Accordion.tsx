import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cls } from './types';

export interface AccordionItemProps {
  id: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: AccordionItemProps[];
  defaultOpen?: string[];
  /** Controlled open state. */
  openItems?: string[];
  /** Called when open state changes — receives full set of open IDs. */
  onChange?: (openIds: string[]) => void;
  multiple?: boolean;
  flush?: boolean;
}

export function Accordion({
  items,
  defaultOpen = [],
  openItems: controlledOpen,
  onChange,
  multiple = false,
  flush = false,
  className = '',
  ...props
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState<Set<string>>(new Set(defaultOpen));

  const open = controlledOpen ? new Set(controlledOpen) : internalOpen;

  function toggle(id: string) {
    const next = new Set(open);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (!multiple) next.clear();
      next.add(id);
    }
    setInternalOpen(next);
    onChange?.(Array.from(next));
  }

  return (
    <div className={cls('av-accordion', flush && 'av-accordion-flush', className)} {...props}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} className={cls('av-accordion-item', isOpen && 'av-accordion-item-open')}>
            <button
              type="button"
              className="av-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`av-acc-${item.id}`}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggle(item.id)}
            >
              {item.label}
              <span className="av-accordion-icon" aria-hidden="true" />
            </button>
            <div
              id={`av-acc-${item.id}`}
              className={cls('av-accordion-body', isOpen && 'av-accordion-body-open')}
              role="region"
              aria-labelledby={`av-acc-trigger-${item.id}`}
            >
              <div className="av-accordion-content">{item.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
