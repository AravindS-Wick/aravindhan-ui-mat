<script setup lang="ts">
import { computed } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: string;
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  size?: Size;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  id?: string;
}>(), { size: 'md', fullWidth: false, required: false, disabled: false, success: false, type: 'text' });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const uid = computed(() => props.id ?? `tf-${Math.random().toString(36).slice(2, 7)}`);
const hasError = computed(() => Boolean(props.error));

const wrapperClass = computed(() =>
  cls('av-text-field', props.fullWidth && 'av-text-field-full',
    hasError.value && 'av-text-field-error', props.success && 'av-text-field-success')
);
const inputClass = computed(() =>
  cls('av-input', props.size !== 'md' && `av-input-${props.size}`,
    hasError.value && 'av-input-error', props.success && 'av-input-success')
);
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="uid" class="av-form-label">
      {{ label }}<span v-if="required" class="av-form-required" aria-hidden="true"> *</span>
    </label>
    <div :class="cls('av-input-wrapper', $slots.start && 'av-input-wrapper-start', $slots.end && 'av-input-wrapper-end')">
      <span v-if="$slots.start" class="av-input-adornment av-input-adornment-start"><slot name="start" /></span>
      <input
        :id="uid"
        :class="inputClass"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="hasError || undefined"
        :aria-describedby="hasError ? `${uid}-error` : helperText ? `${uid}-helper` : undefined"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="$slots.end" class="av-input-adornment av-input-adornment-end"><slot name="end" /></span>
    </div>
    <p v-if="hasError" :id="`${uid}-error`" class="av-form-helper av-form-helper-error" role="alert">{{ error }}</p>
    <p v-else-if="helperText" :id="`${uid}-helper`" class="av-form-helper">{{ helperText }}</p>
  </div>
</template>
