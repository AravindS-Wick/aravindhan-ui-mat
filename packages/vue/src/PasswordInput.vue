<script setup lang="ts">
import { computed, ref } from 'vue';
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
  showStrength?: boolean;
  id?: string;
}>(), {
  size: 'md',
  fullWidth: false,
  required: false,
  disabled: false,
  success: false,
  showStrength: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'input': [e: Event];
}>();

const uid = computed(() => props.id ?? `pw-${Math.random().toString(36).slice(2, 7)}`);
const hasError = computed(() => Boolean(props.error));
const visible = ref(false);

const currentValue = computed(() => props.modelValue ?? '');

function getStrength(password: string): { level: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const level = Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { level, label: labels[level] };
}

const strength = computed(() => props.showStrength ? getStrength(currentValue.value) : null);

const strengthClass = computed(() => {
  if (!strength.value) return '';
  const lvl = strength.value.level;
  if (lvl <= 1) return 'weak';
  if (lvl <= 2) return 'fair';
  if (lvl === 3) return 'good';
  return 'strong';
});

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  emit('input', e);
};
</script>

<template>
  <div :class="cls('av-password-field')">
    <div :class="cls('av-text-field', fullWidth && 'av-text-field-full', hasError && 'av-text-field-error')">
      <label v-if="label" :for="uid" class="av-form-label">
        {{ label }}
        <span v-if="required" class="av-form-required" aria-hidden="true"> *</span>
      </label>
      <div class="av-input-wrapper av-input-wrapper-end">
        <input
          :id="uid"
          :type="visible ? 'text' : 'password'"
          :class="cls('av-input', size && size !== 'md' && `av-input-${size}`, hasError && 'av-input-error')"
          :value="modelValue"
          :required="required"
          :disabled="disabled"
          :aria-invalid="hasError || undefined"
          @input="onInput"
        />
        <span class="av-input-adornment av-input-adornment-end">
          <button
            type="button"
            class="av-password-toggle"
            :aria-label="visible ? 'Hide password' : 'Show password'"
            tabindex="-1"
            @click="visible = !visible"
          >
            <slot v-if="visible" name="hide-icon">🙈</slot>
            <slot v-else name="show-icon">👁️</slot>
          </button>
        </span>
      </div>
      <p v-if="hasError" class="av-form-helper av-form-helper-error" role="alert">
        {{ error }}
      </p>
      <p v-else-if="helperText" class="av-form-helper">
        {{ helperText }}
      </p>
    </div>
    
    <div v-if="showStrength && currentValue" class="av-password-strength" aria-live="polite">
      <div class="av-password-strength-bars">
        <span
          v-for="lvl in [1, 2, 3, 4]"
          :key="lvl"
          :class="cls(
            'av-password-strength-bar',
            lvl <= strength!.level && `av-password-strength-${strengthClass}`
          )"
        />
      </div>
      <span v-if="strength && strength.label" class="av-password-strength-label">
        {{ strength.label }}
      </span>
    </div>
  </div>
</template>
