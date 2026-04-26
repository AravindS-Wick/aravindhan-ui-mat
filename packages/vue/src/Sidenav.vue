<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  collapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
  variant?: 'default' | 'floating' | 'bordered';
}>(), { collapsed: false, width: '240px', collapsedWidth: '56px', variant: 'default' });

const navClass = computed(() =>
  cls('av-sidenav', `av-sidenav-${props.variant}`, props.collapsed && 'av-sidenav-collapsed')
);

const navStyle = computed(() => ({
  width: props.collapsed ? props.collapsedWidth : props.width,
}));
</script>

<template>
  <nav :class="navClass" :style="navStyle" aria-label="Side navigation">
    <slot />
  </nav>
</template>
