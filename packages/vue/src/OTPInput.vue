<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: string;
  length?: number;
  inputMode?: 'numeric' | 'text';
  masked?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: Size;
  label?: string;
  helperText?: string;
  errorText?: string;
  gap?: string;
}>(), {
  length: 6,
  inputMode: 'numeric',
  masked: false,
  error: false,
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
  'complete': [value: string];
}>();

const digits = ref<string[]>(Array(props.length).fill(''));

watch(() => props.modelValue, (newVal) => {
  const arr = Array(props.length).fill('');
  if (newVal) newVal.slice(0, props.length).split('').forEach((c, i) => { arr[i] = c; });
  digits.value = arr;
}, { immediate: true });

const inputRefs = ref<(HTMLInputElement | null)[]>([]);

function update(index: number, char: string) {
  const next = [...digits.value];
  next[index] = char;
  digits.value = next;
  const joined = next.join('');
  emit('update:modelValue', joined);
  emit('change', joined);
  if (next.every((d) => d !== '')) emit('complete', joined);
}

function handleKey(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace') {
    if (digits.value[index]) {
      update(index, '');
    } else if (index > 0) {
      update(index - 1, '');
      inputRefs.value[index - 1]?.focus();
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  } else if (e.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus();
  }
}

function handleChange(val: string, index: number) {
  const char = val.replace(/\D/g, '').slice(-1);
  if (props.inputMode === 'text' || char || props.inputMode !== 'numeric') {
    const c = val.slice(-1);
    update(index, c);
    if (c && index < props.length - 1) inputRefs.value[index + 1]?.focus();
  }
}

function handlePaste(e: ClipboardEvent, startIndex: number) {
  e.preventDefault();
  if (!e.clipboardData) return;
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, props.length - startIndex);
  const next = [...digits.value];
  text.split('').forEach((c, i) => { next[startIndex + i] = c; });
  digits.value = next;
  const joined = next.join('');
  emit('update:modelValue', joined);
  emit('change', joined);
  const focusIdx = Math.min(startIndex + text.length, props.length - 1);
  inputRefs.value[focusIdx]?.focus();
  if (next.every((d) => d !== '')) emit('complete', joined);
}

const onFocus = (e: FocusEvent) => {
  (e.target as HTMLInputElement).select();
};
</script>

<template>
  <div :class="cls('av-otp')">
    <label v-if="label" class="av-form-label">{{ label }}</label>
    <div
      :class="cls('av-otp-inputs', size !== 'md' && `av-otp-${size}`, error && 'av-otp-error')"
      :style="gap ? { gap } : undefined"
      role="group"
      :aria-label="label ?? 'One-time password'"
    >
      <input
        v-for="(digit, i) in digits"
        :key="i"
        :ref="(el) => { inputRefs[i] = el as HTMLInputElement; }"
        :type="masked ? 'password' : 'text'"
        :inputmode="inputMode"
        :pattern="inputMode === 'numeric' ? '[0-9]' : undefined"
        maxLength="1"
        :value="digit"
        :disabled="disabled"
        :class="cls(
          'av-otp-input',
          error && 'av-otp-input-error',
          digit && 'av-otp-input-filled'
        )"
        :aria-label="`Digit ${i + 1} of ${length}`"
        @input="handleChange(($event.target as HTMLInputElement).value, i)"
        @keydown="handleKey($event, i)"
        @paste="handlePaste($event, i)"
        @focus="onFocus"
      />
    </div>
    <p v-if="error && errorText" class="av-form-helper av-form-helper-error" role="alert">
      {{ errorText }}
    </p>
    <p v-else-if="helperText" class="av-form-helper">
      {{ helperText }}
    </p>
  </div>
</template>
