import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cls, type Size, type ColorScheme } from './types';

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Current pressed state. */
  selected?: boolean;
  /** Called on toggle. */
  onChange?: (selected: boolean) => void;
  /** Value identifier (used in ToggleButtonGroup). */
  value?: string;
  /** Color when selected. Defaults to `'primary'`. */
  color?: ColorScheme;
  /** Size modifier. Defaults to `'md'`. */
  size?: Size;
}

export function ToggleButton({
  selected,
  onChange,
  value,
  color = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ToggleButtonProps) {
  const [internalSelected, setInternal] = useState(false);
  const isSelected = selected ?? internalSelected;

  function handleClick() {
    const next = !isSelected;
    setInternal(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      role="button"
      aria-pressed={isSelected}
      data-value={value}
      className={cls(
        'av-toggle-btn',
        isSelected && `av-toggle-btn-active av-toggle-btn-${color}`,
        size !== 'md' && `av-toggle-btn-${size}`,
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ToggleButtonGroupProps {
  /** Selected values (controlled). */
  value?: string[];
  /** Default selected values (uncontrolled). */
  defaultValue?: string[];
  /** Called with new selection array. */
  onChange?: (values: string[]) => void;
  /** Allow only one selected at a time. */
  exclusive?: boolean;
  /** Size for all buttons. */
  size?: Size;
  /** Color for selected buttons. */
  color?: ColorScheme;
  className?: string;
  children: ReactNode;
}

export function ToggleButtonGroup({
  value: controlledValue,
  defaultValue = [],
  onChange,
  exclusive = false,
  size,
  color = 'primary',
  className = '',
  children,
}: ToggleButtonGroupProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = controlledValue ?? internal;

  function handleChange(val: string, pressed: boolean) {
    let next: string[];
    if (exclusive) {
      next = pressed ? [val] : [];
    } else {
      next = pressed ? [...selected, val] : selected.filter((v) => v !== val);
    }
    setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      role="group"
      className={cls('av-toggle-btn-group', size && `av-toggle-btn-group-${size}`, className)}
    >
      {/* Clone children injecting selected state */}
      {Array.isArray(children)
        ? (children as React.ReactElement<ToggleButtonProps>[]).map((child) => {
            if (!child?.props?.value) return child;
            return {
              ...child,
              props: {
                ...child.props,
                color,
                size: size ?? child.props.size,
                selected: selected.includes(child.props.value!),
                onChange: (pressed: boolean) => handleChange(child.props.value!, pressed),
              },
            };
          })
        : children}
    </div>
  );
}

import type React from 'react';
