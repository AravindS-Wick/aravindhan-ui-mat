import { forwardRef, useState, useRef, useId, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cls, type Size } from './types';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: Size;
  fullWidth?: boolean;
  /** Debounce delay in ms. 0 = no debounce. Defaults to 0. */
  debounce?: number;
  /** Called with the search value (debounced if set). */
  onSearch?: (value: string) => void;
  /** Show clear button when input has value. */
  clearable?: boolean;
  /** Loading state (shows spinner). */
  loading?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    label,
    size = 'md',
    fullWidth = false,
    debounce = 0,
    onSearch,
    clearable = true,
    loading = false,
    className = '',
    id,
    value: controlledValue,
    defaultValue = '',
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internal, setInternal] = useState(String(defaultValue));
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const displayValue = controlledValue !== undefined ? String(controlledValue) : internal;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInternal(val);
    onChange?.(e);

    if (onSearch) {
      clearTimeout(timer.current);
      if (debounce > 0) {
        timer.current = setTimeout(() => onSearch(val), debounce);
      } else {
        onSearch(val);
      }
    }
  }

  function clear() {
    setInternal('');
    onSearch?.('');
    if (ref && 'current' in ref && ref.current) {
      ref.current.value = '';
      ref.current.focus();
    }
  }

  return (
    <div className={cls('av-search-input', fullWidth && 'av-search-input-full', className)}>
      {label && <label htmlFor={inputId} className="av-form-label">{label}</label>}
      <div className={cls('av-input-wrapper av-input-wrapper-start', displayValue && clearable && 'av-input-wrapper-end')}>
        <span className="av-input-adornment av-input-adornment-start" aria-hidden="true">
          {loading
            ? <span className="av-spinner av-spinner-border av-spinner-sm av-spinner-primary" role="status" aria-label="Searching" />
            : <span className="av-search-icon">🔍</span>
          }
        </span>
        <input
          ref={ref}
          id={inputId}
          type="search"
          className={cls('av-input', size !== 'md' && `av-input-${size}`)}
          value={displayValue}
          onChange={handleChange}
          autoComplete="off"
          {...props}
        />
        {clearable && displayValue && (
          <span className="av-input-adornment av-input-adornment-end">
            <button type="button" className="av-search-clear" aria-label="Clear search" onClick={clear}>&times;</button>
          </span>
        )}
      </div>
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

