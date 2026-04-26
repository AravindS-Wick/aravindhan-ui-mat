<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  initials?: string;
  size?: Size;
  color?: ColorScheme;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}>(), { alt: '', size: 'md', color: 'primary', shape: 'circle' });

const className = computed(() =>
  cls('av-avatar',
    props.size !== 'md' && `av-avatar-${props.size}`,
    props.shape === 'square' && 'av-avatar-square',
    !props.src && `av-avatar-${props.color}`,
  )
);
</script>

<template>
  <span :class="className">
    <img v-if="src" :src="src" :alt="alt" class="av-avatar-img" />
    <span v-else class="av-avatar-initials" :aria-label="alt || initials">{{ initials }}</span>
    <span v-if="status" :class="`av-avatar-status av-avatar-status-${status}`" :aria-label="status" />
  </span>
</template>
