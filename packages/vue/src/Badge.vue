<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  variant?: ColorScheme;
  size?: Size;
  pill?: boolean;
  outline?: boolean;
}>(), { variant: 'primary', size: 'md', pill: false, outline: false });

const className = computed(() =>
  cls(
    'av-badge', `av-badge-${props.variant}`,
    props.size !== 'md' && `av-badge-${props.size}`,
    props.pill && 'av-badge-pill',
    props.outline && 'av-badge-outline',
  )
);
</script>

<template>
  <span :class="className"><slot /></span>
</template>
