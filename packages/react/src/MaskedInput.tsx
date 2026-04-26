import { forwardRef, useRef, type InputHTMLAttributes, type ChangeEvent } from 'react';
import { cls, type Size } from './types';

export type MaskPreset = 'phone' | 'phone-us' | 'card' | 'date' | 'time' | 'ssn' | 'zip';

export interface MaskedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** Custom mask string. Use `#` for digits, `A` for letters, `*` for any char. */
  mask?: string;
  /** Preset mask. Overridden by `mask` if both provided. */
  preset?: MaskPreset;
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
  /** Called with raw (unmasked) value. */
  onValueChange?: (raw: string, masked: string) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PRESETS: Record<MaskPreset, string> = {
  'phone': '+# (###) ###-####',
  'phone-us': '(###) ###-####',
  'card': '#### #### #### ####',
  'date': '##/##/####',
  'time': '##:##',
  'ssn': '###-##-####',
  'zip': '#####',
};

function applyMask(raw: string, mask: string): string {
  let result = '';
  let rawIdx = 0;
  for (let i = 0; i < mask.length && rawIdx < raw.length; i++) {
    const m = mask[i];
    const c = raw[rawIdx];
    if (m === '#') {
      if (/\d/.test(c)) { result += c; rawIdx++; }
      else rawIdx++;
    } else if (m === 'A') {
      if (/[a-zA-Z]/.test(c)) { result += c; rawIdx++; }
      else rawIdx++;
    } else if (m === '*') {
      result += c; rawIdx++;
    } else {
      result += m;
      if (c === m) rawIdx++;
    }
  }
  return result;
}

function stripMask(masked: string, mask: string): string {
  return masked.split('').filter((c, i) => {
    const m = mask[i];
    return m === '#' || m === 'A' || m === '*';
  }).join('');
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  {
    mask: customMask,
    preset,
    label,
    helperText,
    error,
    size,
    fullWidth,
    onValueChange,
    onChange,
    placeholder,
    className = '',
    id,
    required,
    disabled,
    value,
    defaultValue,
    ...props
  },
  ref,
) {
  const mask = customMask ?? (preset ? PRESETS[preset] : undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? inputRef;
  const inputId = id ?? (label ? `av-masked-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const autoPlaceholder = mask?.replace(/#/g, '0').replace(/A/g, 'A').replace(/\*/g, '_');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!mask) { onChange?.(e); return; }
    const raw = stripMask(e.target.value, mask);
    const masked = applyMask(raw, mask);
    e.target.value = masked;
    onValueChange?.(raw, masked);
    onChange?.(e);
  };

  return (
    <div className={cls('av-text-field', fullWidth && 'av-text-field-full', error && 'av-text-field-error', className)}>
      {label && (
        <label className="av-form-label" htmlFor={inputId}>
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={resolvedRef}
        id={inputId}
        type="text"
        inputMode={preset === 'card' || preset === 'zip' || preset === 'ssn' || preset?.startsWith('phone') ? 'numeric' : undefined}
        className={cls('av-input', size && size !== 'md' && `av-input-${size}`, error && 'av-input-error')}
        placeholder={placeholder ?? autoPlaceholder}
        required={required}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={Boolean(error) || undefined}
        {...props}
      />
      {error && <p className="av-form-helper av-form-helper-error" role="alert">{error}</p>}
      {!error && helperText && <p className="av-form-helper">{helperText}</p>}
    </div>
  );
});
MaskedInput.displayName = 'MaskedInput';

import type React from 'react';
