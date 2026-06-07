<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = defineProps<{
  fluid?: boolean;
}>();

const className = computed(() =>
  cls(
    'av-input-group',
    props.fluid && 'av-input-group-fluid'
  )
);
</script>

<template>
  <div :class="className">
    <span v-if="$slots.prepend" class="av-input-group-text">
      <slot name="prepend" />
    </span>
    <slot />
    <span v-if="$slots.append" class="av-input-group-text">
      <slot name="append" />
    </span>
  </div>
</template>
