<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  alternate?: boolean;
  reverse?: boolean;
}>(), { alternate: false, reverse: false });

const className = computed(() =>
  cls('av-timeline', props.alternate && 'av-timeline-alternate', props.reverse && 'av-timeline-reverse')
);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
