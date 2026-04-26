<script setup lang="ts">
defineProps<{ ariaLabel?: string }>();
</script>

<template>
  <nav :aria-label="ariaLabel ?? 'Breadcrumb'">
    <ol class="av-breadcrumb">
      <slot />
    </ol>
  </nav>
</template>
