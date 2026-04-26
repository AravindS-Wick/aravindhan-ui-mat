<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

type SkeletonVariant = 'text' | 'rect' | 'circle' | 'button' | 'avatar' | 'card';

const props = withDefaults(defineProps<{
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}>(), { variant: 'text', animation: 'pulse' });

function px(v: string | number) { return typeof v === 'number' ? `${v}px` : v; }

const className = computed(() =>
  cls('av-skeleton', `av-skeleton-${props.variant}`, props.animation !== 'none' && `av-skeleton-${props.animation}`)
);

const inlineStyle = computed(() => ({
  ...(props.width ? { width: px(props.width) } : {}),
  ...(props.height ? { height: px(props.height) } : {}),
}));
</script>

<template>
  <div v-if="lines && lines > 1" class="av-skeleton-group">
    <div
      v-for="i in lines"
      :key="i"
      :class="className"
      :style="i === lines ? { ...inlineStyle, width: '70%' } : inlineStyle"
    />
  </div>
  <div v-else :class="className" :style="inlineStyle" />
</template>
