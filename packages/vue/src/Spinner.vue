<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  variant?: 'border' | 'dots' | 'grow';
  color?: ColorScheme;
  size?: Size;
  label?: string;
}>(), { variant: 'border', color: 'primary', size: 'md', label: 'Loading…' });

const className = computed(() =>
  cls('av-spinner', `av-spinner-${props.variant}`, `av-spinner-${props.color}`, props.size !== 'md' && `av-spinner-${props.size}`)
);
</script>

<template>
  <span :class="className" role="status" :aria-label="label">
    <span class="av-sr-only">{{ label }}</span>
  </span>
</template>
