import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cls, type Size } from './types';

export interface OTPInputProps {
  /** Number of digits. Defaults to 6. */
  length?: number;
  /** Controlled value (joined string). */
  value?: string;
  /** Called with joined string when any digit changes. */
  onChange?: (value: string) => void;
  /** Called when all digits are filled. */
  onComplete?: (value: string) => void;
  /** Input type — 'numeric' shows number pad on mobile. */
  inputMode?: 'numeric' | 'text';
  /** Mask input like a PIN. */
  masked?: boolean;
  /** Error state. */
  error?: boolean;
  /** Disable all inputs. */
  disabled?: boolean;
  /** Size modifier. */
  size?: Size;
  label?: string;
  helperText?: string;
  errorText?: string;
  className?: string;
  /** Gap between boxes. */
  gap?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  inputMode = 'numeric',
  masked = false,
  error = false,
  disabled = false,
  size = 'md',
  label,
  helperText,
  errorText,
  className = '',
  gap,
}: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array(length).fill('');
    if (value) value.slice(0, length).split('').forEach((c, i) => { arr[i] = c; });
    return arr;
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const controlled = value !== undefined
    ? Array(length).fill('').map((_, i) => value[i] ?? '')
    : digits;

  function update(index: number, char: string) {
    const next = [...controlled];
    next[index] = char;
    setDigits(next);
    const joined = next.join('');
    onChange?.(joined);
    if (next.every((d) => d !== '')) onComplete?.(joined);
    return next;
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Backspace') {
      if (controlled[index]) {
        update(index, '');
      } else if (index > 0) {
        update(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleChange(val: string, index: number) {
    const char = val.replace(/\D/g, '').slice(-1);
    if (inputMode === 'text' || char || inputMode !== 'numeric') {
      const c = val.slice(-1);
      update(index, c);
      if (c && index < length - 1) inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>, startIndex: number) {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - startIndex);
    const next = [...controlled];
    text.split('').forEach((c, i) => { next[startIndex + i] = c; });
    setDigits(next);
    const joined = next.join('');
    onChange?.(joined);
    const focusIdx = Math.min(startIndex + text.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
    if (next.every((d) => d !== '')) onComplete?.(joined);
  }

  return (
    <div className={cls('av-otp', className)}>
      {label && <label className="av-form-label">{label}</label>}
      <div
        className={cls('av-otp-inputs', size !== 'md' && `av-otp-${size}`, error && 'av-otp-error')}
        style={gap ? { gap } : undefined}
        role="group"
        aria-label={label ?? 'One-time password'}
      >
        {controlled.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type={masked ? 'password' : 'text'}
            inputMode={inputMode}
            pattern={inputMode === 'numeric' ? '[0-9]' : undefined}
            maxLength={1}
            value={digit}
            disabled={disabled}
            className={cls(
              'av-otp-input',
              error && 'av-otp-input-error',
              digit && 'av-otp-input-filled',
            )}
            aria-label={`Digit ${i + 1} of ${length}`}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKey(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {(error && errorText) ? (
        <p className="av-form-helper av-form-helper-error" role="alert">{errorText}</p>
      ) : helperText ? (
        <p className="av-form-helper">{helperText}</p>
      ) : null}
    </div>
  );
}
