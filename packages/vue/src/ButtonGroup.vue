<script setup lang="ts">
import { computed } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  size?: Size;
  vertical?: boolean;
  fluid?: boolean;
}>(), {
  vertical: false,
  fluid: false,
});

const className = computed(() =>
  cls(
    'av-btn-group',
    props.vertical && 'av-btn-group-vertical',
    props.fluid && 'av-btn-group-fluid',
    props.size && `av-btn-group-${props.size}`
  )
);
</script>

<template>
  <div role="group" :class="className">
    <slot />
  </div>
</template>
