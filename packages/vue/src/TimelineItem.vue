<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme } from './types';

const props = withDefaults(defineProps<{
  time?: string;
  title?: string;
  dotColor?: ColorScheme;
}>(), { dotColor: 'primary' });

const dotClass = computed(() => cls('av-timeline-dot', `av-timeline-dot-${props.dotColor}`));
</script>

<template>
  <div class="av-timeline-item">
    <div :class="dotClass"><slot name="dot" /></div>
    <div class="av-timeline-content">
      <time v-if="time" class="av-timeline-time">{{ time }}</time>
      <div v-if="title" class="av-timeline-title">{{ title }}</div>
      <div class="av-timeline-body"><slot /></div>
    </div>
  </div>
</template>
