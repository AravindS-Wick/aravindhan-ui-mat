<script setup lang="ts">
import { computed } from 'vue';
import { cls, type Variant, type Size } from './types';

const props = withDefaults(defineProps<{
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  block: false,
  disabled: false,
  type: 'button',
});

const emit = defineEmits<{ click: [e: MouseEvent] }>();

const className = computed(() =>
  cls(
    'av-btn',
    `av-btn-${props.variant}`,
    props.size !== 'md' && `av-btn-${props.size}`,
    props.loading && 'av-btn-loading',
    props.block && 'av-btn-block',
  )
);
</script>

<template>
  <button
    :class="className"
    :type="type"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <slot name="startIcon" />
    <slot />
    <slot name="endIcon" />
  </button>
</template>
