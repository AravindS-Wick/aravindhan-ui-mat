<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  value: string | number;
  label: string;
  description?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  bordered?: boolean;
}>(), { bordered: false });

const className = computed(() => cls('av-stat', props.bordered && 'av-stat-bordered'));
</script>

<template>
  <div :class="className">
    <div v-if="$slots.icon" class="av-stat-icon"><slot name="icon" /></div>
    <div class="av-stat-body">
      <div class="av-stat-value">{{ value }}</div>
      <div class="av-stat-label">{{ label }}</div>
      <div v-if="description" class="av-stat-description">{{ description }}</div>
      <div v-if="trend" :class="cls('av-stat-trend', trendDirection && `av-stat-trend-${trendDirection}`)">{{ trend }}</div>
    </div>
  </div>
</template>
