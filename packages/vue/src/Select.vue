<script setup lang="ts">
import { computed } from 'vue';
import { cls, type Size } from './types';
import { useFieldProps } from './FormProvider';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

const props = withDefaults(defineProps<{
  modelValue?: any;
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  size?: Size;
  fullWidth?: boolean;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}>(), {
  success: false,
  size: 'md',
  fullWidth: false,
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [e: Event];
}>();

const fieldProps = useFieldProps(props);

const uid = computed(() => props.id ?? `sel-${Math.random().toString(36).slice(2, 7)}`);
const hasError = computed(() => Boolean(props.error));

const wrapperClass = computed(() =>
  cls(
    'av-select-field',
    props.fullWidth && 'av-select-field-full',
    hasError.value && 'av-select-field-error',
    props.success && 'av-select-field-success'
  )
);

const selectClass = computed(() =>
  cls(
    'av-select',
    props.size !== 'md' && `av-select-${props.size}`,
    hasError.value && 'av-select-error',
    props.success && 'av-select-success'
  )
);

const onChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  emit('update:modelValue', val);
  emit('change', e);
};
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="uid" class="av-form-label">
      {{ label }}
      <span v-if="fieldProps.required" class="av-form-required" aria-hidden="true"> *</span>
    </label>
    
    <div :class="cls('av-select-wrapper', $slots.start && 'av-select-wrapper-start')">
      <span v-if="$slots.start" class="av-input-adornment av-input-adornment-start" aria-hidden="true">
        <slot name="start" />
      </span>
      
      <select
        :id="uid"
        :class="selectClass"
        :value="modelValue"
        :disabled="fieldProps.disabled"
        :required="fieldProps.required"
        :aria-invalid="hasError || undefined"
        :aria-describedby="hasError ? `${uid}-error` : helperText ? `${uid}-helper` : undefined"
        @change="onChange"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        
        <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
          {{ opt.label }}
        </option>
        
        <optgroup v-for="group in groups" :key="group.label" :label="group.label">
          <option v-for="opt in group.options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
            {{ opt.label }}
          </option>
        </optgroup>
        
        <slot />
      </select>
      
      <span class="av-select-arrow" aria-hidden="true" />
    </div>
    
    <p v-if="hasError" :id="`${uid}-error`" class="av-form-helper av-form-helper-error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="helperText" :id="`${uid}-helper`" class="av-form-helper">
      {{ helperText }}
    </p>
  </div>
</template>
