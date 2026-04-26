<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  open: boolean;
  size?: Size;
  staticBackdrop?: boolean;
}>(), { size: 'md', staticBackdrop: false });

const emit = defineEmits<{ close: [] }>();

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.staticBackdrop) emit('close');
}

watch(() => props.open, (v) => {
  if (v) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKey);
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKey);
});

function handleBackdrop(e: MouseEvent) {
  if (!props.staticBackdrop && (e.target as HTMLElement).classList.contains('av-modal-backdrop-show')) {
    emit('close');
  }
}

const dialogClass = computed(() => cls('av-modal-dialog', props.size !== 'md' && `av-modal-${props.size}`));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="av-modal-backdrop av-modal-backdrop-show"
      role="presentation"
      @click="handleBackdrop"
    >
      <div :class="dialogClass" role="dialog" aria-modal="true">
        <div v-if="$slots.title" class="av-modal-header">
          <h5 class="av-modal-title"><slot name="title" /></h5>
          <button type="button" class="av-modal-close" aria-label="Close" @click="emit('close')">&times;</button>
        </div>
        <div class="av-modal-body"><slot /></div>
        <div v-if="$slots.footer" class="av-modal-footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
