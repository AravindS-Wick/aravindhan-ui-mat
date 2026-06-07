<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  vertical?: boolean;
}>(), {
  vertical: false,
});

const className = computed(() =>
  cls(
    'av-split-pane',
    props.vertical && 'av-split-pane--vertical'
  )
);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
