<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  color?: ColorScheme;
  size?: Size;
  outlined?: boolean;
  clickable?: boolean;
}>(), { color: 'primary', size: 'md', outlined: false, clickable: false });

const emit = defineEmits<{ delete: []; click: [e: MouseEvent] }>();

const className = computed(() =>
  cls('av-chip', `av-chip-${props.color}`, props.outlined && 'av-chip-outlined',
    props.size !== 'md' && `av-chip-${props.size}`, props.clickable && 'av-chip-clickable')
);
</script>

<template>
  <span :class="className" :role="clickable ? 'button' : undefined" :tabindex="clickable ? 0 : undefined" @click="clickable && emit('click', $event)">
    <slot name="avatar" />
    <slot name="icon" />
    <span class="av-chip-label"><slot /></span>
    <button v-if="$slots.delete !== undefined || $attrs.onDelete" type="button" class="av-chip-delete" aria-label="Remove" @click.stop="emit('delete')">&times;</button>
  </span>
</template>
