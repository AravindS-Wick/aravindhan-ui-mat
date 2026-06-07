<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  showTooltip?: boolean;
  color?: ColorScheme;
  size?: Size;
  label?: string;
  marks?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  disabled?: boolean;
}>(), {
  min: 0,
  max: 100,
  step: 1,
  showTooltip: false,
  color: 'primary',
  size: 'md',
  marks: false,
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  'change': [e: Event];
  'input': [e: Event];
}>();

const uid = computed(() => props.id ?? `sld-${Math.random().toString(36).slice(2, 7)}`);

const wrapperClass = computed(() =>
  cls(
    'av-slider-wrapper',
    props.size !== 'md' && `av-slider-${props.size}`,
    props.error && 'av-slider-error'
  )
);

const sliderClass = computed(() =>
  cls(
    'av-slider',
    `av-slider-${props.color}`,
    props.showTooltip && 'av-slider-tooltip'
  )
);

const onInput = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  emit('update:modelValue', val);
  emit('input', e);
};

const onChange = (e: Event) => {
  emit('change', e);
};
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="uid" class="av-form-label">{{ label }}</label>
    <div class="av-slider-track-wrapper">
      <input
        type="range"
        :id="uid"
        :min="min"
        :max="max"
        :step="step"
        :class="sliderClass"
        :value="modelValue"
        :disabled="disabled"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-invalid="error || undefined"
        @input="onInput"
        @change="onChange"
      />
      <div v-if="marks" class="av-slider-marks" aria-hidden="true">
        <span class="av-slider-mark-label">{{ min }}</span>
        <span class="av-slider-mark-label">{{ max }}</span>
      </div>
    </div>
    <p v-if="helperText" :class="cls('av-form-helper', error && 'av-form-helper-error')">
      {{ helperText }}
    </p>
  </div>
</template>
