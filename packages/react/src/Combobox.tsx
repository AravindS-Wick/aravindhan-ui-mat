import { useState, useRef, useEffect, useId, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cls } from './types';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ComboboxOption[];
  /** Controlled value (single select). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: ComboboxOption) => void;
  /** Enable multi-select mode. */
  multiple?: boolean;
  /** Controlled values (multi select). */
  values?: string[];
  defaultValues?: string[];
  onChangeMultiple?: (values: string[], options: ComboboxOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  noOptionsText?: string;
  label?: string;
}

export function Combobox({
  options,
  value: controlledValue,
  defaultValue = '',
  onChange,
  multiple = false,
  values: controlledValues,
  defaultValues = [],
  onChangeMultiple,
  placeholder = 'Search…',
  disabled = false,
  error = false,
  clearable = false,
  noOptionsText = 'No options',
  label,
  className = '',
  id,
  ...props
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // Single-select state
  const [internal, setInternal] = useState(defaultValue);
  // Multi-select state
  const [internalMulti, setInternalMulti] = useState<string[]>(defaultValues);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = controlledValue ?? internal;
  const selectedValues = controlledValues ?? internalMulti;

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';

  const filtered = options.filter(
    (o) => !query || o.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  function handleSelectSingle(opt: ComboboxOption) {
    if (opt.disabled) return;
    setInternal(opt.value);
    onChange?.(opt.value, opt);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleSelectMultiple(opt: ComboboxOption) {
    if (opt.disabled) return;
    const next = selectedValues.includes(opt.value)
      ? selectedValues.filter((v) => v !== opt.value)
      : [...selectedValues, opt.value];
    setInternalMulti(next);
    onChangeMultiple?.(next, options.filter((o) => next.includes(o.value)));
    // Keep open, reset query so user can keep selecting
    setQuery('');
    inputRef.current?.focus();
  }

  function handleSelect(opt: ComboboxOption) {
    if (multiple) handleSelectMultiple(opt);
    else handleSelectSingle(opt);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((f) => Math.min(f + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused((f) => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && open && filtered[focused]) handleSelect(filtered[focused]);
    if (e.key === 'Escape') setOpen(false);
  }

  function removeValue(val: string) {
    const next = selectedValues.filter((v) => v !== val);
    setInternalMulti(next);
    onChangeMultiple?.(next, options.filter((o) => next.includes(o.value)));
  }

  function clearAll() {
    if (multiple) {
      setInternalMulti([]);
      onChangeMultiple?.([], []);
    } else {
      setInternal('');
      onChange?.('', { value: '', label: '' });
    }
  }

  const hasValue = multiple ? selectedValues.length > 0 : Boolean(selected);

  return (
    <div className={cls('av-combobox', disabled && 'av-combobox-disabled', error && 'av-combobox-error', className)} {...props}>
      {label && <label htmlFor={inputId} className="av-form-label">{label}</label>}
      <div className="av-combobox-control">
        {multiple && selectedValues.length > 0 && (
          <div className="av-combobox-tags">
            {selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span key={val} className="av-combobox-tag">
                  {opt?.label ?? val}
                  <button
                    type="button"
                    className="av-combobox-tag-remove"
                    aria-label={`Remove ${opt?.label ?? val}`}
                    onMouseDown={(e) => { e.preventDefault(); removeValue(val); }}
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className="av-input av-combobox-input"
          placeholder={open || (multiple && selectedValues.length > 0) ? placeholder : (selectedLabel || placeholder)}
          value={open ? query : (multiple ? '' : selectedLabel)}
          disabled={disabled}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocused(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
        />
        {clearable && hasValue && (
          <button
            type="button"
            className="av-combobox-clear"
            aria-label="Clear"
            onMouseDown={(e) => { e.preventDefault(); clearAll(); }}
          >
            &times;
          </button>
        )}
        <span className="av-combobox-arrow" aria-hidden="true" />
      </div>
      {open && (
        <ul ref={listRef} className="av-combobox-menu" role="listbox" aria-multiselectable={multiple}>
          {filtered.length === 0 ? (
            <li className="av-combobox-empty">{noOptionsText}</li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = multiple ? selectedValues.includes(opt.value) : opt.value === selected;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  className={cls(
                    'av-combobox-option',
                    isSelected && 'av-combobox-option-selected',
                    i === focused && 'av-combobox-option-focused',
                    opt.disabled && 'av-combobox-option-disabled',
                  )}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                >
                  {multiple && (
                    <span className="av-combobox-option-check" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                  )}
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
