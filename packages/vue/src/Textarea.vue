<script setup lang="ts">
import { computed, ref, watchEffect, onMounted, nextTick } from 'vue';
import { cls, type Size } from './types';
import { useFieldProps } from './FormProvider';

const props = withDefaults(defineProps<{
  modelValue?: string;
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  size?: Size;
  fullWidth?: boolean;
  autoResize?: boolean;
  showCount?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  id?: string;
}>(), {
  success: false,
  size: 'md',
  fullWidth: false,
  autoResize: false,
  showCount: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'input': [e: Event];
}>();

const fieldProps = useFieldProps(props);

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const uid = computed(() => props.id ?? `ta-${Math.random().toString(36).slice(2, 7)}`);
const hasError = computed(() => Boolean(props.error));

const charCount = computed(() => (props.modelValue ?? '').length);

const resize = () => {
  if (!props.autoResize || !textareaRef.value) return;
  textareaRef.value.style.height = 'auto';
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
};

watchEffect(() => {
  if (props.modelValue !== undefined) {
    nextTick(resize);
  }
});

onMounted(() => {
  nextTick(resize);
});

const wrapperClass = computed(() =>
  cls(
    'av-textarea-field',
    props.fullWidth && 'av-textarea-field-full',
    hasError.value && 'av-textarea-field-error',
    props.success && 'av-textarea-field-success'
  )
);

const textareaClass = computed(() =>
  cls(
    'av-textarea',
    props.size !== 'md' && `av-textarea-${props.size}`,
    hasError.value && 'av-textarea-error',
    props.success && 'av-textarea-success',
    props.autoResize && 'av-textarea-autoresize',
    props.fullWidth && 'av-textarea-full'
  )
);

const handleInput = (e: Event) => {
  const val = (e.target as HTMLTextAreaElement).value;
  emit('update:modelValue', val);
  emit('input', e);
  resize();
};
</script>

<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="uid" class="av-form-label">
      {{ label }}
      <span v-if="fieldProps.required" class="av-form-required" aria-hidden="true"> *</span>
    </label>
    <textarea
      ref="textareaRef"
      :id="uid"
      :class="textareaClass"
      :value="modelValue"
      :disabled="fieldProps.disabled"
      :readonly="fieldProps.readonly"
      :required="fieldProps.required"
      :maxLength="maxLength"
      :aria-invalid="hasError || undefined"
      :aria-describedby="hasError ? `${uid}-error` : helperText ? `${uid}-helper` : undefined"
      @input="handleInput"
    />
    <div class="av-textarea-footer">
      <p v-if="hasError" :id="`${uid}-error`" class="av-form-helper av-form-helper-error" role="alert">
        {{ error }}
      </p>
      <p v-else-if="helperText" :id="`${uid}-helper`" class="av-form-helper">
        {{ helperText }}
      </p>
      <span v-else />
      <span v-if="showCount && maxLength" :class="cls('av-textarea-count', charCount >= maxLength && 'av-textarea-count-max')">
        {{ charCount }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>
