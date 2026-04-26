<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  flush?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}>(), { flush: false, hoverable: false, bordered: false });

const className = computed(() =>
  cls('av-card', props.flush && 'av-card-flush', props.hoverable && 'av-card-hoverable', props.bordered && 'av-card-bordered')
);
</script>

<template>
  <div :class="className">
    <div v-if="$slots.header" class="av-card-header"><slot name="header" /></div>
    <div class="av-card-body"><slot /></div>
    <div v-if="$slots.footer" class="av-card-footer"><slot name="footer" /></div>
  </div>
</template>
