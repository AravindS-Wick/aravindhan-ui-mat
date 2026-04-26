<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme } from './types';

const props = withDefaults(defineProps<{
  variant?: ColorScheme;
  dismissible?: boolean;
}>(), { variant: 'info', dismissible: false });

const emit = defineEmits<{ dismiss: [] }>();

const className = computed(() => cls('av-alert', `av-alert-${props.variant}`));
</script>

<template>
  <div :class="className" role="alert">
    <slot name="icon" />
    <div class="av-alert-body">
      <div v-if="$slots.title" class="av-alert-title"><slot name="title" /></div>
      <div class="av-alert-message"><slot /></div>
    </div>
    <button v-if="dismissible" type="button" class="av-alert-dismiss" aria-label="Dismiss" @click="emit('dismiss')">
      &times;
    </button>
  </div>
</template>
