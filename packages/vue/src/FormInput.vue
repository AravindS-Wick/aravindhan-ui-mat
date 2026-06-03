<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';
import { useFieldProps } from './FormProvider';

const props = withDefaults(defineProps<{
  modelValue?: string | number;
  error?: boolean;
  success?: boolean;
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
    'av-input',
    props.error && 'av-input-error',
    props.success && 'av-input-success'
  )
);
</script>

<template>
  <input
    :class="className"
    :value="modelValue"
    :disabled="fieldProps.disabled"
    :readonly="fieldProps.readonly"
    :required="fieldProps.required"
    :aria-invalid="error || undefined"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
