<script setup lang="ts">
import { ref, computed } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  size?: Size;
  filledIcon?: string;
  emptyIcon?: string;
  label?: string;
}>(), {
  modelValue: 0,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  filledIcon: '★',
  emptyIcon: '☆',
  label: 'Rating',
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  'change': [value: number];
}>();

const hoverValue = ref(0);
const displayValue = computed(() => hoverValue.value || props.modelValue);

const className = computed(() =>
  cls(
    'av-rating',
    props.size !== 'md' && `av-rating-${props.size}`,
    props.readOnly && 'av-rating-readonly',
    props.disabled && 'av-rating-disabled'
  )
);

const handleClick = (v: number) => {
  if (props.readOnly || props.disabled) return;
  emit('update:modelValue', v);
  emit('change', v);
};

const handleMouseEnter = (v: number) => {
  if (props.readOnly || props.disabled) return;
  hoverValue.value = v;
};

const handleMouseLeave = () => {
  hoverValue.value = 0;
};
</script>

<template>
  <div
    :class="className"
    role="radiogroup"
    :aria-label="label"
  >
    <button
      v-for="v in max"
      :key="v"
      type="button"
      role="radio"
      :aria-checked="v === modelValue"
      :aria-label="`${v} star${v !== 1 ? 's' : ''}`"
      :class="cls('av-rating-star', v <= displayValue && 'av-rating-star-filled')"
      :disabled="disabled"
      :tabindex="disabled || readOnly ? -1 : 0"
      @click="handleClick(v)"
      @mouseenter="handleMouseEnter(v)"
      @mouseleave="handleMouseLeave"
    >
      {{ v <= displayValue ? filledIcon : emptyIcon }}
    </button>
  </div>
</template>
