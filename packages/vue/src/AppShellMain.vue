<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <main :class="cls('av-app-shell__main')">
    <slot />
  </main>
</template>
