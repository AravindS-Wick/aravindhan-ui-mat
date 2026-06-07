<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <div :class="cls('av-split-pane__pane')">
    <slot />
  </div>
</template>
