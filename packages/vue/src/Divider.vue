<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  vertical?: boolean;
  label?: string;
  variant?: 'solid' | 'dashed' | 'dotted';
}>(), {
  vertical: false,
  variant: 'solid',
});

const isLabeled = computed(() => !!props.label);

const className = computed(() =>
  cls(
    'av-divider',
    props.vertical && 'av-divider-vertical',
    props.variant !== 'solid' && `av-divider-${props.variant}`,
  )
);
</script>

<template>
  <div v-if="isLabeled" :class="cls('av-divider', 'av-divider-labeled')">
    <span class="av-divider-label">{{ label }}</span>
  </div>
  <hr
    v-else
    :class="className"
    aria-hidden="true"
  />
</template>
