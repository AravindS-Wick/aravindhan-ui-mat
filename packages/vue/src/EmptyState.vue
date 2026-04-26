<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}>(), { size: 'md' });

const className = computed(() => cls('av-empty-state', props.size !== 'md' && `av-empty-state-${props.size}`));
</script>

<template>
  <div :class="className" role="status">
    <div v-if="$slots.illustration" class="av-empty-state-illustration"><slot name="illustration" /></div>
    <div class="av-empty-state-title">{{ title }}</div>
    <div v-if="description" class="av-empty-state-description">{{ description }}</div>
    <div v-if="$slots.action" class="av-empty-state-actions"><slot name="action" /></div>
  </div>
</template>
