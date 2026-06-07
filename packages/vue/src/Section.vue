<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}>(), {
  size: 'md',
  fullWidth: false,
});

const className = computed(() =>
  cls(
    'av-section',
    `av-section-${props.size}`,
    props.fullWidth && 'av-section-full',
  )
);
</script>

<template>
  <section :class="className">
    <slot />
  </section>
</template>
