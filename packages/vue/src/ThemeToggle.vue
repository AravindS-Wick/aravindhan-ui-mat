<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { cls } from './types';

type Theme = 'light' | 'dark' | 'forest' | 'ocean' | 'professional' | 'corporate';
const ICONS: Record<string, string> = { light: '☀️', dark: '🌙', forest: '🌲', ocean: '🌊', professional: '💼', corporate: '🏢' };

const props = withDefaults(defineProps<{
  themes?: Theme[];
  modelValue?: Theme;
  defaultTheme?: Theme;
  showLabel?: boolean;
}>(), {
  themes: () => ['light', 'dark'] as Theme[],
  defaultTheme: 'light',
  showLabel: false,
});

const emit = defineEmits<{ 'update:modelValue': [theme: Theme] }>();

const internal = ref<Theme>(props.modelValue ?? props.defaultTheme);
const current = computed(() => props.modelValue ?? internal.value);

watch(current, (theme) => {
  document.documentElement.setAttribute('data-av-theme', theme);
}, { immediate: true });

function cycle() {
  const idx = props.themes.indexOf(current.value);
  const next = props.themes[(idx + 1) % props.themes.length];
  internal.value = next;
  emit('update:modelValue', next);
}
</script>

<template>
  <button
    type="button"
    :class="cls('av-theme-toggle', `av-theme-toggle-${current}`)"
    :aria-label="`Switch theme (current: ${current})`"
    @click="cycle"
  >
    <span aria-hidden="true">{{ ICONS[current] ?? '🎨' }}</span>
    <span v-if="showLabel" class="av-theme-toggle-label">{{ current }}</span>
  </button>
</template>
