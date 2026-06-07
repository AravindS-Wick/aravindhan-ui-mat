<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <span :class="cls('av-input-group-text')">
    <slot />
  </span>
</template>
