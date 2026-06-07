<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid';

const props = withDefaults(defineProps<{
  size?: ContainerSize;
  centered?: boolean;
}>(), {
  size: 'lg',
  centered: true,
});

const className = computed(() =>
  cls(
    props.size === 'fluid' ? 'av-container-fluid' : 'av-container',
    props.size !== 'lg' && props.size !== 'fluid' && `av-container-${props.size}`,
    props.centered && 'av-container-centered',
  )
);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
