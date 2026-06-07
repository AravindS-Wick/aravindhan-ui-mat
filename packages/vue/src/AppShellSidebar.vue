<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  collapsed?: boolean;
  mobileOpen?: boolean;
}>(), {
  collapsed: false,
  mobileOpen: false,
});

const className = computed(() =>
  cls(
    'av-app-shell__sidebar',
    props.collapsed && 'av-app-shell__sidebar--collapsed',
    props.mobileOpen && 'av-app-shell__sidebar--mobile-open'
  )
);
</script>

<template>
  <aside :class="className">
    <slot />
  </aside>
</template>
