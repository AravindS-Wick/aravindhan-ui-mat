<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  mobileToggled?: boolean;
}>(), {
  mobileToggled: false,
});

const className = computed(() =>
  cls(
    'av-app-shell',
    props.mobileToggled && 'av-app-shell--mobile-toggled'
  )
);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
