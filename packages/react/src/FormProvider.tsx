import { createContext, useContext, type ReactNode } from 'react';
import type { Size } from './types';

export interface FormContextValue {
  /** Propagated to all child inputs/selects/textareas. */
  disabled?: boolean;
  /** Propagated to all child inputs. */
  readOnly?: boolean;
  /** Propagated to all child fields. */
  size?: Size;
  /** Mark all fields as required. */
  required?: boolean;
  /** When true, adds noValidate to the underlying form element. */
  noValidate?: boolean;
}

const FormContext = createContext<FormContextValue>({});

export function useFormContext(): FormContextValue {
  return useContext(FormContext);
}

export interface FormProviderProps extends FormContextValue {
  children: ReactNode;
}

export function FormProvider({ children, ...value }: FormProviderProps) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

/**
 * Merges local props with FormProvider context.
 * Local props take precedence — field-level overrides always win.
 */
export function useFieldProps<T extends FormContextValue>(localProps: T): T & FormContextValue {
  const ctx = useFormContext();
  return {
    disabled: localProps.disabled ?? ctx.disabled,
    readOnly: localProps.readOnly ?? ctx.readOnly,
    size: localProps.size ?? ctx.size,
    required: localProps.required ?? ctx.required,
    ...localProps,
  };
}
