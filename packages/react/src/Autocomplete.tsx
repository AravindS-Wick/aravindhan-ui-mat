import { useState, useRef, useEffect, type HTMLAttributes, type KeyboardEvent, type ChangeEvent } from 'react';
import { cls } from './types';

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelectOption?: (option: AutocompleteOption) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  noOptionsText?: string;
}

export function Autocomplete({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSelectOption,
  options,
  placeholder = 'Search...',
  disabled = false,
  clearable = false,
  noOptionsText = 'No results found',
  className = '',
  ...props
}: AutocompleteProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(currentValue.toLowerCase()) || 
    opt.value.toLowerCase().includes(currentValue.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(true);
    setFocusedIndex(0);
  }

  function handleSelect(opt: AutocompleteOption) {
    if (!isControlled) setInternalValue(opt.label);
    onChange?.(opt.label);
    onSelectOption?.(opt);
    setOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && filteredOptions[focusedIndex]) {
        e.preventDefault();
        handleSelect(filteredOptions[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function clearValue() {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cls('av-autocomplete', disabled && 'av-autocomplete-disabled', className)} {...props}>
      <div className="av-autocomplete-control">
        <input
          type="text"
          className="av-input av-autocomplete-input"
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {clearable && currentValue && !disabled && (
          <button type="button" className="av-autocomplete-clear" onClick={clearValue} aria-label="Clear">
            &times;
          </button>
        )}
      </div>
      
      {open && currentValue.length > 0 && (
        <ul className="av-autocomplete-menu" role="listbox">
          {filteredOptions.length === 0 ? (
            <li className="av-autocomplete-empty">{noOptionsText}</li>
          ) : (
            filteredOptions.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={i === focusedIndex}
                className={cls('av-autocomplete-option', i === focusedIndex && 'av-autocomplete-option-focused')}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input from losing focus
                  handleSelect(opt);
                }}
                onMouseEnter={() => setFocusedIndex(i)}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
