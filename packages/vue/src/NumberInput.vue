<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: number | null;
  label?: string;
  helperText?: string;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  stepper?: boolean;
  controls?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}>(), {
  size: 'md',
  fullWidth: false,
  step: 1,
  stepper: true,
  controls: false,
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
  'change': [value: number | null];
}>();

const uid = computed(() => props.id ?? `num-${Math.random().toString(36).slice(2, 7)}`);
const hasError = computed(() => Boolean(props.error));

const internal = ref<string>(
  props.modelValue != null ? String(props.modelValue) : ''
);

watch(() => props.modelValue, (newVal) => {
  if (newVal != null) {
    internal.value = String(newVal);
  } else {
    internal.value = '';
  }
});

function clamp(v: number) {
  if (props.min != null && v < props.min) return props.min;
  if (props.max != null && v > props.max) return props.max;
  return v;
}

function format(v: number) {
  return props.precision != null ? Number(v.toFixed(props.precision)) : v;
}

function increment() {
  const current = parseFloat(internal.value) || 0;
  const next = format(clamp(current + props.step));
  internal.value = String(next);
  emit('update:modelValue', next);
  emit('change', next);
}

function decrement() {
  const current = parseFloat(internal.value) || 0;
  const next = format(clamp(current - props.step));
  internal.value = String(next);
  emit('update:modelValue', next);
  emit('change', next);
}

function handleChange(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  internal.value = raw;
  const parsed = raw === '' ? null : parseFloat(raw);
  if (parsed === null) {
    emit('update:modelValue', null);
    emit('change', null);
  } else if (!isNaN(parsed)) {
    const next = format(clamp(parsed));
    emit('update:modelValue', next);
    emit('change', next);
  }
}
</script>

<template>
  <div :class="cls('av-number-input', fullWidth && 'av-number-input-full', hasError && 'av-number-input-error')">
    <label v-if="label" :for="uid" class="av-form-label">
      {{ label }}
      <span v-if="required" class="av-form-required" aria-hidden="true"> *</span>
    </label>
    
    <div :class="cls('av-number-input-control', size !== 'md' && `av-number-input-${size}`)">
      <button
        v-if="controls"
        type="button"
        class="av-number-input-btn"
        :disabled="disabled || (min != null && parseFloat(internal) <= min)"
        aria-label="Decrease"
        @click="decrement"
      >
        −
      </button>
      
      <input
        type="number"
        :id="uid"
        :class="cls('av-input', 'av-number-input-field', size !== 'md' && `av-input-${size}`, hasError && 'av-input-error')"
        :value="internal"
        :step="step"
        :min="min"
        :max="max"
        :required="required"
        :disabled="disabled"
        :aria-invalid="hasError || undefined"
        @input="handleChange"
      />
      
      <button
        v-if="controls"
        type="button"
        class="av-number-input-btn"
        :disabled="disabled || (max != null && parseFloat(internal) >= max)"
        aria-label="Increase"
        @click="increment"
      >
        +
      </button>
      
      <div v-if="stepper && !controls" class="av-number-input-stepper">
        <button
          type="button"
          class="av-number-input-step-up"
          :disabled="disabled || (max != null && parseFloat(internal) >= max)"
          aria-label="Increase"
          tabindex="-1"
          @click="increment"
        >
          ▲
        </button>
        <button
          type="button"
          class="av-number-input-step-down"
          :disabled="disabled || (min != null && parseFloat(internal) <= min)"
          aria-label="Decrease"
          tabindex="-1"
          @click="decrement"
        >
          ▼
        </button>
      </div>
    </div>
    
    <p v-if="hasError" class="av-form-helper av-form-helper-error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="av-form-helper">
      {{ helperText }}
    </p>
  </div>
</template>
