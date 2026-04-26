<script setup lang="ts">
import { ref, computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  sticky?: 'top' | 'bottom';
  transparent?: boolean;
  variant?: 'light' | 'dark';
  fluid?: boolean;
}>(), { variant: 'light', fluid: false });

const expanded = ref(false);

const navClass = computed(() =>
  cls('av-navbar', `av-navbar-${props.variant}`,
    props.sticky && `av-navbar-sticky-${props.sticky}`,
    props.transparent && 'av-navbar-transparent')
);
</script>

<template>
  <nav :class="navClass">
    <div :class="cls(fluid ? 'av-container-fluid' : 'av-container', 'av-navbar-container')">
      <div v-if="$slots.brand" class="av-navbar-brand"><slot name="brand" /></div>
      <button
        type="button"
        :class="cls('av-navbar-toggler', expanded && 'av-navbar-toggler-open')"
        :aria-expanded="expanded"
        aria-label="Toggle navigation"
        @click="expanded = !expanded"
      >
        <span class="av-navbar-toggler-icon" />
      </button>
      <div :class="cls('av-navbar-collapse', expanded && 'av-navbar-collapse-open')">
        <slot />
      </div>
    </div>
  </nav>
</template>
