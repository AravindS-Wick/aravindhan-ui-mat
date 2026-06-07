<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';
import { useFieldProps } from './FormProvider';

const props = withDefaults(defineProps<{
  modelValue?: string;
  error?: boolean;
  success?: boolean;
  autoResize?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
}>(), {});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const fieldProps = useFieldProps(props);

const className = computed(() =>
  cls(
    'av-textarea',
    props.error && 'av-textarea-error',
    props.success && 'av-textarea-success',
    props.autoResize && 'av-textarea-autoresize'
  )
);
</script>

<template>
  <textarea
    :class="className"
    :value="modelValue"
    :disabled="fieldProps.disabled"
    :readonly="fieldProps.readonly"
    :required="fieldProps.required"
    :aria-invalid="error || undefined"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
