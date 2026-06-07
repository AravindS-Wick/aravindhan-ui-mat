<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = defineProps<{
  error?: boolean;
  success?: boolean;
}>();

const className = computed(() =>
  cls(
    'av-form-field',
    props.error && 'av-form-field-error',
    props.success && 'av-form-field-success'
  )
);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
