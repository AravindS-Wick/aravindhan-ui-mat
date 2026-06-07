<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { cls } from './types';

type SpanRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const props = withDefaults(defineProps<{
  span?: SpanRange;
  colStart?: number;
  rowSpan?: number;
  smSpan?: SpanRange;
  mdSpan?: SpanRange;
  lgSpan?: SpanRange;
}>(), {
  span: 1,
});

const className = computed(() =>
  cls(
    'av-grid-item',
    props.span !== 1 && `av-col-span-${props.span}`,
    props.smSpan && `av-sm-col-span-${props.smSpan}`,
    props.mdSpan && `av-md-col-span-${props.mdSpan}`,
    props.lgSpan && `av-lg-col-span-${props.lgSpan}`,
  )
);

const inlineStyle = computed<CSSProperties>(() => ({
  ...(props.colStart ? { gridColumnStart: props.colStart } : {}),
  ...(props.rowSpan ? { gridRow: `span ${props.rowSpan}` } : {}),
}));
</script>

<template>
  <div :class="className" :style="inlineStyle">
    <slot />
  </div>
</template>
