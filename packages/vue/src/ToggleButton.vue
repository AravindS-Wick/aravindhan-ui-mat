<script setup lang="ts">
import { inject, computed } from 'vue';
import { cls, type Size, type ColorScheme } from './types';

const props = withDefaults(defineProps<{
  selected?: boolean;
  value?: string;
  color?: ColorScheme;
  size?: Size;
}>(), {
  color: 'primary',
  size: 'md',
});

const emit = defineEmits<{
  'update:selected': [value: boolean];
  'change': [value: boolean];
}>();

const groupContext = inject<any>('toggle-button-group', null);

const isSelected = computed(() => {
  if (groupContext && props.value !== undefined) {
    return groupContext.selected.value.includes(props.value);
  }
  return props.selected;
});

const buttonSize = computed(() => (groupContext?.size.value ?? props.size));
const buttonColor = computed(() => (groupContext?.color.value ?? props.color));

const handleClick = () => {
  const next = !isSelected.value;
  emit('update:selected', next);
  emit('change', next);
  
  if (groupContext && props.value !== undefined) {
    groupContext.onChange(props.value, next);
  }
};

const className = computed(() =>
  cls(
    'av-toggle-btn',
    isSelected.value && `av-toggle-btn-active av-toggle-btn-${buttonColor.value}`,
    buttonSize.value !== 'md' && `av-toggle-btn-${buttonSize.value}`
  )
);
</script>

<template>
  <button
    type="button"
    role="button"
    :aria-pressed="isSelected"
    :data-value="value"
    :class="className"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
