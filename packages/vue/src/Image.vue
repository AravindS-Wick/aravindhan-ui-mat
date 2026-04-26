<script setup lang="ts">
import { ref, computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'circle';
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  ratio?: string;
  lazy?: boolean;
  fallback?: string;
  caption?: string;
  fluid?: boolean;
}>(), { alt: '', fit: 'cover', lazy: false, fluid: false });

const errored = ref(false);

const imgClass = computed(() =>
  cls('av-img', props.fluid && 'av-img-fluid', props.radius && `av-rounded-${props.radius}`,
    props.fit !== 'cover' && `av-object-${props.fit}`)
);

function onError(e: Event) {
  if (props.fallback && !errored.value) {
    errored.value = true;
    (e.target as HTMLImageElement).src = props.fallback;
  }
}
</script>

<template>
  <figure v-if="ratio || caption" class="av-img-figure" :style="ratio ? { aspectRatio: ratio } : undefined">
    <img :class="imgClass" :src="src" :alt="alt" :loading="lazy ? 'lazy' : undefined" @error="onError" />
    <figcaption v-if="caption" class="av-img-caption">{{ caption }}</figcaption>
  </figure>
  <img v-else :class="imgClass" :src="src" :alt="alt" :loading="lazy ? 'lazy' : undefined" @error="onError" />
</template>
