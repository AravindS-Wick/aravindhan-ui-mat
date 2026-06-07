<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <div :class="cls('av-masonry')">
    <slot />
  </div>
</template>
