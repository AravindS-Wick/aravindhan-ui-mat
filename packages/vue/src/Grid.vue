<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { cls } from './types';

type ColRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const props = withDefaults(defineProps<{
  cols?: ColRange;
  gap?: CSSProperties['gap'];
  smCols?: ColRange;
  mdCols?: ColRange;
  lgCols?: ColRange;
}>(), {
  cols: 12,
});

const className = computed(() =>
  cls(
    'av-grid',
    `av-grid-cols-${props.cols}`,
    props.smCols && `av-grid-sm-cols-${props.smCols}`,
    props.mdCols && `av-grid-md-cols-${props.mdCols}`,
    props.lgCols && `av-grid-lg-cols-${props.lgCols}`,
  )
);

const inlineStyle = computed<CSSProperties>(() => ({
  ...(props.gap ? { gap: props.gap } : {}),
}));
</script>

<template>
  <div :class="className" :style="inlineStyle">
    <slot />
  </div>
</template>
