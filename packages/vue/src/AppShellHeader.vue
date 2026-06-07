<script setup lang="ts">
import { cls } from './types';
</script>

<template>
  <header :class="cls('av-app-shell__header')">
    <slot />
  </header>
</template>
