<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  as?: string;
  display?: CSSProperties['display'];
  direction?: CSSProperties['flexDirection'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: CSSProperties['gap'];
  p?: CSSProperties['padding'];
  px?: CSSProperties['padding'];
  py?: CSSProperties['padding'];
  m?: CSSProperties['margin'];
  w?: CSSProperties['width'];
  h?: CSSProperties['height'];
  overflow?: CSSProperties['overflow'];
  position?: CSSProperties['position'];
  radius?: CSSProperties['borderRadius'];
  bg?: CSSProperties['background'];
}>(), {
  as: 'div',
});

const inlineStyle = computed<CSSProperties>(() => ({
  ...(props.display ? { display: props.display } : {}),
  ...(props.direction ? { flexDirection: props.direction } : {}),
  ...(props.align ? { alignItems: props.align } : {}),
  ...(props.justify ? { justifyContent: props.justify } : {}),
  ...(props.gap ? { gap: props.gap } : {}),
  ...(props.p ? { padding: props.p } : {}),
  ...(props.px ? { paddingLeft: props.px, paddingRight: props.px } : {}),
  ...(props.py ? { paddingTop: props.py, paddingBottom: props.py } : {}),
  ...(props.m ? { margin: props.m } : {}),
  ...(props.w ? { width: props.w } : {}),
  ...(props.h ? { height: props.h } : {}),
  ...(props.overflow ? { overflow: props.overflow } : {}),
  ...(props.position ? { position: props.position } : {}),
  ...(props.radius ? { borderRadius: props.radius } : {}),
  ...(props.bg ? { background: props.bg } : {}),
}));
</script>

<template>
  <component :is="as" :class="cls('av-box')" :style="inlineStyle">
    <slot />
  </component>
</template>
