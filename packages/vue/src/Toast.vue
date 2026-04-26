<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { cls, type ColorScheme } from './types';

const props = withDefaults(defineProps<{
  variant?: ColorScheme;
  dismissible?: boolean;
  duration?: number;
}>(), { dismissible: true, duration: 4000 });

const emit = defineEmits<{ dismiss: [] }>();

let timer: ReturnType<typeof setTimeout>;

onMounted(() => {
  if (props.duration !== 0) {
    timer = setTimeout(() => emit('dismiss'), props.duration);
  }
});

onUnmounted(() => clearTimeout(timer));

const toastClass = computed(() => cls('av-toast', props.variant && `av-toast-${props.variant}`));
</script>

<script lang="ts">
import { computed } from 'vue';
</script>

<template>
  <div :class="toastClass" role="alert" aria-live="assertive" aria-atomic="true">
    <slot name="icon" />
    <div class="av-toast-body">
      <div v-if="$slots.title" class="av-toast-title"><slot name="title" /></div>
      <div class="av-toast-message"><slot /></div>
    </div>
    <button v-if="dismissible" type="button" class="av-toast-dismiss" aria-label="Dismiss" @click="emit('dismiss')">&times;</button>
  </div>
</template>
