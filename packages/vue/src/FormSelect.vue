<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';
import { useFieldProps } from './FormProvider';

const props = withDefaults(defineProps<{
  modelValue?: any;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
}>(), {});

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const fieldProps = useFieldProps(props);

const className = computed(() =>
  cls(
    'av-select',
    props.error && 'av-select-error',
    props.success && 'av-select-success'
  )
);
</script>

<template>
  <select
    :class="className"
    :value="modelValue"
    :disabled="fieldProps.disabled"
    :required="fieldProps.required"
    :aria-invalid="error || undefined"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
