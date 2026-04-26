<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  outlined?: boolean;
  transparent?: boolean;
}>(), { elevation: 1, radius: 'md', outlined: false, transparent: false });

const className = computed(() =>
  cls('av-paper',
    !props.outlined && props.elevation > 0 && `av-shadow-${props.elevation}`,
    props.outlined && 'av-paper-outlined',
    props.radius !== 'md' && `av-rounded-${props.radius}`,
    props.transparent && 'av-paper-transparent',
  )
);
</script>

<template>
  <div :class="className"><slot /></div>
</template>
