<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: any;
  value?: any;
  checked?: boolean;
  label?: string;
  color?: ColorScheme;
  size?: Size;
  error?: boolean;
  id?: string;
  disabled?: boolean;
}>(), {
  color: 'primary',
  size: 'md',
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [e: Event];
}>();

const uid = computed(() => props.id ?? `rd-${Math.random().toString(36).slice(2, 7)}`);

const wrapperClass = computed(() =>
  cls(
    'av-radio-wrapper',
    props.size !== 'md' && `av-radio-${props.size}`,
    props.error && 'av-radio-error',
    props.disabled && 'av-radio-disabled'
  )
);

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue === props.value;
  }
  return props.checked;
});

const onChange = (e: Event) => {
  emit('update:modelValue', props.value);
  emit('change', e);
};
</script>

<template>
  <label :for="uid" :class="wrapperClass">
    <input
      type="radio"
      :id="uid"
      :class="cls('av-radio', `av-radio-${color}`)"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      @change="onChange"
    />
    <span v-if="label" class="av-radio-label">{{ label }}</span>
  </label>
</template>
