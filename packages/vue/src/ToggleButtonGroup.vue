<script setup lang="ts">
import { provide, computed, ref } from 'vue';
import { cls, type Size, type ColorScheme } from './types';

const props = withDefaults(defineProps<{
  modelValue?: string[];
  exclusive?: boolean;
  size?: Size;
  color?: ColorScheme;
}>(), {
  exclusive: false,
  color: 'primary',
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'change': [value: string[]];
}>();

const internalValue = ref<string[]>([]);
const currentValue = computed(() => props.modelValue ?? internalValue.value);

const handleToggle = (val: string, pressed: boolean) => {
  let next: string[];
  if (props.exclusive) {
    next = pressed ? [val] : [];
  } else {
    next = pressed ? [...currentValue.value, val] : currentValue.value.filter((v) => v !== val);
  }
  
  if (props.modelValue === undefined) {
    internalValue.value = next;
  }
  
  emit('update:modelValue', next);
  emit('change', next);
};

provide('toggle-button-group', {
  selected: currentValue,
  size: computed(() => props.size),
  color: computed(() => props.color),
  onChange: handleToggle
});

const className = computed(() =>
  cls(
    'av-toggle-btn-group',
    props.size && `av-toggle-btn-group-${props.size}`
  )
);
</script>

<template>
  <div role="group" :class="className">
    <slot />
  </div>
</template>
