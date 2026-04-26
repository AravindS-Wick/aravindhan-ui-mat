<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  placement?: 'bottom' | 'bottom-end' | 'top';
  closeOnClick?: boolean;
}>(), { placement: 'bottom', closeOnClick: true });

const open = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

function handleOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) open.value = false;
}

function toggle() {
  open.value = !open.value;
  if (open.value) document.addEventListener('mousedown', handleOutside);
  else document.removeEventListener('mousedown', handleOutside);
}

onUnmounted(() => document.removeEventListener('mousedown', handleOutside));

const menuClass = computed(() =>
  cls('av-dropdown-menu', open.value && 'av-dropdown-menu-open',
    props.placement === 'bottom-end' && 'av-dropdown-menu-end',
    props.placement === 'top' && 'av-dropdown-menu-top',
  )
);
</script>

<template>
  <div ref="wrapperRef" class="av-dropdown">
    <div class="av-dropdown-trigger" :aria-expanded="open" aria-haspopup="listbox" @click="toggle">
      <slot name="trigger" />
    </div>
    <ul :class="menuClass" role="listbox" @click="() => { if (closeOnClick) open = false; }">
      <slot />
    </ul>
  </div>
</template>
