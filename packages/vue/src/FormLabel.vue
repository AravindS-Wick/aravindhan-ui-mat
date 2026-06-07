<script setup lang="ts">
import { cls } from './types';

defineProps<{
  required?: boolean;
}>();
</script>

<template>
  <label :class="cls('av-form-label')">
    <slot />
    <span v-if="required" class="av-form-required" aria-hidden="true"> *</span>
  </label>
</template>
