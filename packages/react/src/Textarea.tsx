import { forwardRef, useEffect, useId, useRef, useState, type RefObject, type TextareaHTMLAttributes } from 'react';
import { cls, type Size } from './types';
import { useFieldProps } from './FormProvider';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  /** Error message — also sets aria-invalid. */
  error?: string;
  success?: boolean;
  size?: Size;
  fullWidth?: boolean;
  /** Auto-grow to fit content. */
  autoResize?: boolean;
  /** Show character count (requires maxLength). */
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  rawProps,
  ref,
) {
  const {
    label,
    helperText,
    error,
    success = false,
    size = 'md',
    fullWidth = false,
    required = false,
    autoResize = false,
    showCount = false,
    className = '',
    id,
    value,
    defaultValue,
    maxLength,
    onChange,
    ...props
  } = useFieldProps(rawProps);
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const resolvedRef = (ref as RefObject<HTMLTextAreaElement>) ?? innerRef;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  useEffect(() => {
    if (!autoResize || !resolvedRef?.current) return;
    const el = resolvedRef.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  });

  const [charCount, setCharCount] = useState(
    String(value ?? defaultValue ?? '').length,
  );

  return (
    <div
      className={cls(
        'av-textarea-field',
        fullWidth && 'av-textarea-field-full',
        hasError && 'av-textarea-field-error',
        success && 'av-textarea-field-success',
        className,
      )}
    >
      {label && (
        <label htmlFor={inputId} className="av-form-label">
          {label}
          {required && <span className="av-form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <textarea
        ref={resolvedRef}
        id={inputId}
        className={cls(
          'av-textarea',
          size !== 'md' && `av-textarea-${size}`,
          hasError && 'av-textarea-error',
          success && 'av-textarea-success',
          autoResize && 'av-textarea-autoresize',
          fullWidth && 'av-textarea-full',
        )}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          setCharCount(e.target.value.length);
          onChange?.(e);
        }}
        {...props}
      />
      <div className="av-textarea-footer">
        {hasError ? (
          <p id={`${inputId}-error`} className="av-form-helper av-form-helper-error" role="alert">{error}</p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="av-form-helper">{helperText}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span className={cls('av-textarea-count', charCount >= maxLength && 'av-textarea-count-max')}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});
Textarea.displayName = 'Textarea';

