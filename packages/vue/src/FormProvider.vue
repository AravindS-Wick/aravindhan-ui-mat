<script setup lang="ts">
import { computed } from 'vue';
import { provideFormContext, type FormContextValue } from './FormProvider';
import type { Size } from './types';

const props = defineProps<{
  disabled?: boolean;
  readOnly?: boolean;
  size?: Size;
  required?: boolean;
}>();

const contextValue = computed<FormContextValue>(() => ({
  disabled: props.disabled,
  readOnly: props.readOnly,
  size: props.size,
  required: props.required,
}));

provideFormContext(contextValue);
</script>

<template>
  <slot />
</template>
