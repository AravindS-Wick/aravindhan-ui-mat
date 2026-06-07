<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = defineProps<{
  error?: boolean;
}>();

const className = computed(() =>
  cls(
    'av-form-helper',
    props.error && 'av-form-helper-error'
  )
);
</script>

<template>
  <p :class="className">
    <slot />
  </p>
</template>
