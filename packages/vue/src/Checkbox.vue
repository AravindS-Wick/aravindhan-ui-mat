<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: any;
  checked?: boolean;
  label?: string;
  indeterminate?: boolean;
  color?: ColorScheme;
  size?: Size;
  error?: boolean;
  helperText?: string;
  id?: string;
  disabled?: boolean;
  value?: any;
}>(), {
  indeterminate: false,
  color: 'primary',
  size: 'md',
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [e: Event];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const uid = computed(() => props.id ?? `cb-${Math.random().toString(36).slice(2, 7)}`);

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate;
  }
});

const wrapperClass = computed(() =>
  cls(
    'av-checkbox-wrapper',
    props.size !== 'md' && `av-checkbox-${props.size}`,
    props.disabled && 'av-checkbox-disabled'
  )
);

const inputClass = computed(() =>
  cls(
    'av-checkbox',
    `av-checkbox-${props.color}`,
    props.error && 'av-checkbox-error'
  )
);

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value);
    }
    return Boolean(props.modelValue);
  }
  return props.checked;
});

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (Array.isArray(props.modelValue)) {
    const copy = [...props.modelValue];
    if (target.checked) {
      copy.push(props.value);
    } else {
      const idx = copy.indexOf(props.value);
      if (idx > -1) copy.splice(idx, 1);
    }
    emit('update:modelValue', copy);
  } else {
    emit('update:modelValue', target.checked);
  }
  emit('change', e);
};
</script>

<template>
  <div :class="cls('av-checkbox-field', error && 'av-checkbox-field-error')">
    <label :for="uid" :class="wrapperClass">
      <input
        ref="inputRef"
        type="checkbox"
        :id="uid"
        :class="inputClass"
        :checked="isChecked"
        :disabled="disabled"
        :aria-checked="indeterminate ? 'mixed' : undefined"
        :aria-invalid="error || undefined"
        @change="onChange"
      />
      <span v-if="label" class="av-checkbox-label">{{ label }}</span>
    </label>
    <p v-if="helperText" :class="cls('av-form-helper', error && 'av-form-helper-error')">
      {{ helperText }}
    </p>
  </div>
</template>
