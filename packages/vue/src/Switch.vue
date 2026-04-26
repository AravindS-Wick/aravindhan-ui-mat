<script setup lang="ts">
import { computed } from 'vue';
import { cls, type ColorScheme, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: boolean;
  label?: string;
  color?: ColorScheme;
  size?: Size;
  labelPlacement?: 'left' | 'right';
  disabled?: boolean;
  id?: string;
}>(), { color: 'primary', size: 'md', labelPlacement: 'right', disabled: false });

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const switchClass = computed(() =>
  cls('av-switch', `av-switch-${props.color}`, props.size !== 'md' && `av-switch-${props.size}`)
);
</script>

<template>
  <div :class="cls('av-switch-wrapper', `av-switch-label-${labelPlacement}`)">
    <span v-if="label && labelPlacement === 'left'" class="av-switch-label-text">{{ label }}</span>
    <label :class="switchClass" :for="id">
      <input
        type="checkbox"
        role="switch"
        :id="id"
        class="av-switch-input"
        :checked="modelValue"
        :disabled="disabled"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="av-switch-track" aria-hidden="true">
        <span class="av-switch-thumb" />
      </span>
    </label>
    <span v-if="label && labelPlacement === 'right'" class="av-switch-label-text">{{ label }}</span>
  </div>
</template>
