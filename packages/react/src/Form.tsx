import { forwardRef, type FormHTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type HTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cls } from './types';

/* ── Form ── */
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  vertical?: boolean;
}
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { vertical = true, className = '', children, onSubmit, ...props },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cls(vertical && 'av-form-vertical', className)}
      onSubmit={onSubmit}
      noValidate
      {...props}
    >
      {children}
    </form>
  );
});
Form.displayName = 'Form';

/* ── FormField ── */
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  error?: boolean;
  success?: boolean;
}
export function FormField({ error, success, className = '', children, ...props }: FormFieldProps) {
  return (
    <div
      className={cls('av-form-field', error && 'av-form-field-error', success && 'av-form-field-success', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── FormLabel ── */
export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}
export function FormLabel({ required, className = '', children, ...props }: FormLabelProps) {
  return (
    <label className={cls('av-form-label', className)} {...props}>
      {children}
      {required && <span className="av-form-required" aria-hidden="true"> *</span>}
    </label>
  );
}

/* ── FormInput ── */
export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { error, success, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cls('av-input', error && 'av-input-error', success && 'av-input-success', className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
});
FormInput.displayName = 'FormInput';

/* ── FormSelect ── */
export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
}
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(function FormSelect(
  { error, success, className = '', children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cls('av-select', error && 'av-select-error', success && 'av-select-success', className)}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  );
});
FormSelect.displayName = 'FormSelect';

/* ── FormTextarea ── */
export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  autoResize?: boolean;
}
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(function FormTextarea(
  { error, success, autoResize, className = '', ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cls(
        'av-textarea',
        error && 'av-textarea-error',
        success && 'av-textarea-success',
        autoResize && 'av-textarea-autoresize',
        className,
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  );
});
FormTextarea.displayName = 'FormTextarea';

/* ── FormCheck ── */
export interface FormCheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  inputType?: 'checkbox' | 'radio';
  toggle?: boolean;
}
export const FormCheck = forwardRef<HTMLInputElement, FormCheckProps>(function FormCheck(
  { label, inputType = 'checkbox', toggle = false, className = '', id, ...props },
  ref,
) {
  return (
    <div className={cls('av-form-check', toggle && 'av-form-switch', className)}>
      <input
        ref={ref}
        type={inputType}
        role={toggle ? 'switch' : undefined}
        className="av-form-check-input"
        id={id}
        {...props}
      />
      {label && (
        <label className="av-form-check-label" htmlFor={id}>{label}</label>
      )}
    </div>
  );
});
FormCheck.displayName = 'FormCheck';

/* ── FormHelperText ── */
export interface FormHelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}
export function FormHelperText({ error, className = '', children, ...props }: FormHelperTextProps) {
  return (
    <p className={cls('av-form-helper', error && 'av-form-helper-error', className)} {...props}>
      {children}
    </p>
  );
}
