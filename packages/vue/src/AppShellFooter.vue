<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <footer :class="cls('av-app-shell__footer')">
    <slot />
  </footer>
</template>
