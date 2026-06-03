import { inject, provide, computed, type ComputedRef } from 'vue';
import type { Size } from './types';

export interface FormContextValue {
  disabled?: boolean;
  readOnly?: boolean;
  size?: Size;
  required?: boolean;
}

export const FormSymbol = Symbol('FormContext');

export function provideFormContext(value: ComputedRef<FormContextValue> | FormContextValue) {
  provide(FormSymbol, value);
}

export function useFormContext(): FormContextValue {
  const ctx = inject<FormContextValue | ComputedRef<FormContextValue>>(FormSymbol, {});
  return 'value' in ctx ? ctx.value : ctx;
}

/**
 * Merges local props with FormProvider context.
 */
export function useFieldProps<T extends FormContextValue>(localProps: T): ComputedRef<T & FormContextValue> {
  const ctx = inject<FormContextValue | ComputedRef<FormContextValue>>(FormSymbol, {});
  
  return computed(() => {
    const contextVal = 'value' in ctx ? ctx.value : ctx;
    return {
      disabled: localProps.disabled ?? contextVal.disabled,
      readOnly: localProps.readOnly ?? contextVal.readOnly,
      size: localProps.size ?? contextVal.size,
      required: localProps.required ?? contextVal.required,
      ...localProps,
    };
  });
}
