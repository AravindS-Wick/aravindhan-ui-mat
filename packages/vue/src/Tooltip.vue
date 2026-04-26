<script setup lang="ts">
import { ref } from 'vue';
import { cls, type Placement } from './types';

const props = withDefaults(defineProps<{
  content: string;
  placement?: Placement;
  delay?: number;
  disabled?: boolean;
}>(), { placement: 'top', delay: 200, disabled: false });

const visible = ref(false);
let timer: ReturnType<typeof setTimeout>;

function show() {
  if (props.disabled) return;
  timer = setTimeout(() => { visible.value = true; }, props.delay);
}
function hide() {
  clearTimeout(timer);
  visible.value = false;
}
</script>

<template>
  <span class="av-tooltip-wrapper" @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide">
    <slot />
    <span v-if="visible" role="tooltip" :class="cls('av-tooltip', `av-tooltip-${placement}`)">
      {{ content }}
    </span>
  </span>
</template>
