<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{ active?: boolean; href?: string }>(), { active: false });
const className = computed(() =>
  cls('av-breadcrumb-item', props.active && 'av-breadcrumb-item-active')
);
</script>

<template>
  <li :class="className" :aria-current="active ? 'page' : undefined">
    <a v-if="!active && href" :href="href"><slot /></a>
    <span v-else><slot /></span>
  </li>
</template>
