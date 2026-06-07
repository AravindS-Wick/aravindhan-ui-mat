<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';
import Radio from './Radio.vue';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

const props = withDefaults(defineProps<{
  modelValue?: string;
  legend?: string;
  options: RadioOption[];
  name: string;
  direction?: 'horizontal' | 'vertical';
  color?: ColorScheme;
  size?: Size;
  error?: string;
  required?: boolean;
}>(), {
  direction: 'vertical',
  color: 'primary',
  size: 'md',
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
}>();

const className = computed(() =>
  cls(
    'av-radio-group',
    `av-radio-group-${props.direction}`,
    props.error && 'av-radio-group-error'
  )
);

const onRadioChange = (val: string) => {
  emit('update:modelValue', val);
  emit('change', val);
};
</script>

<template>
  <fieldset :class="className" :aria-required="required">
    <legend v-if="legend" class="av-radio-group-legend">
      {{ legend }}
      <span v-if="required" class="av-form-required" aria-hidden="true"> *</span>
    </legend>
    
    <div v-for="opt in options" :key="opt.value" class="av-radio-option">
      <Radio
        :id="`${name}-${opt.value}`"
        :name="name"
        :value="opt.value"
        :label="opt.label"
        :disabled="opt.disabled"
        :color="color"
        :size="size"
        :error="!!error"
        :model-value="modelValue"
        @update:model-value="onRadioChange"
      />
      <p v-if="opt.helperText" class="av-radio-helper">{{ opt.helperText }}</p>
    </div>
    
    <p v-if="error" class="av-form-helper av-form-helper-error" role="alert">
      {{ error }}
    </p>
  </fieldset>
</template>
