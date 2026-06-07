<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical';
  gap?: CSSProperties['gap'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: string;
  dividers?: boolean;
}>(), {
  direction: 'vertical',
  wrap: false,
  as: 'div',
  dividers: false,
});

const className = computed(() =>
  cls(
    'av-stack',
    `av-stack-${props.direction}`,
    props.wrap && 'av-stack-wrap',
    props.dividers && 'av-stack-dividers',
  )
);

const inlineStyle = computed<CSSProperties>(() => ({
  ...(props.gap ? { gap: props.gap } : {}),
  ...(props.align ? { alignItems: props.align } : {}),
  ...(props.justify ? { justifyContent: props.justify } : {}),
}));
</script>

<template>
  <component :is="as" :class="className" :style="inlineStyle">
    <slot />
  </component>
</template>
