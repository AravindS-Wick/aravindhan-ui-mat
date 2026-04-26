<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  value?: number;
  variant?: ColorScheme;
  striped?: boolean;
  animated?: boolean;
  size?: Size;
  stacked?: boolean;
}>(), { value: 0, variant: 'primary', striped: false, animated: false, stacked: false });

const clamped = computed(() => Math.max(0, Math.min(100, props.value ?? 0)));
const wrapperClass = computed(() => cls('av-progress', props.size && `av-progress-${props.size}`, props.stacked && 'av-progress-stacked'));
const barClass = computed(() =>
  cls('av-progress-bar', `av-progress-bar-${props.variant}`,
    props.striped && 'av-progress-bar-striped',
    props.animated && 'av-progress-bar-animated',
  )
);
</script>

<template>
  <div :class="wrapperClass">
    <slot v-if="stacked" />
    <div
      v-else
      :class="barClass"
      role="progressbar"
      :style="{ width: `${clamped}%` }"
      :aria-valuenow="clamped"
      aria-valuemin="0"
      aria-valuemax="100"
    />
  </div>
</template>
