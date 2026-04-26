<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue';
import { cls, type Placement, type Size } from './types';

const props = withDefaults(defineProps<{
  open: boolean;
  placement?: Placement;
  size?: Size;
  staticBackdrop?: boolean;
}>(), { placement: 'right', size: 'md', staticBackdrop: false });

const emit = defineEmits<{ close: [] }>();

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.staticBackdrop) emit('close');
}

watch(() => props.open, (v) => {
  if (v) { document.body.style.overflow = 'hidden'; document.addEventListener('keydown', handleKey); }
  else { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); }
});
onUnmounted(() => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); });

function handleBackdrop(e: MouseEvent) {
  if (!props.staticBackdrop && (e.target as HTMLElement).classList.contains('av-drawer-backdrop-show')) emit('close');
}

const drawerClass = computed(() =>
  cls('av-drawer', `av-drawer-${props.placement}`, props.size !== 'md' && `av-drawer-${props.size}`, 'av-drawer-open')
);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="av-drawer-backdrop av-drawer-backdrop-show" role="presentation" @click="handleBackdrop">
      <div :class="drawerClass" role="dialog" aria-modal="true">
        <div v-if="$slots.title" class="av-drawer-header">
          <h5 class="av-drawer-title"><slot name="title" /></h5>
          <button type="button" class="av-drawer-close" aria-label="Close" @click="emit('close')">&times;</button>
        </div>
        <div class="av-drawer-body"><slot /></div>
        <div v-if="$slots.footer" class="av-drawer-footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
