<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

export interface StepItem {
  label: string;
  description?: string;
}

const props = withDefaults(defineProps<{
  steps: StepItem[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  showCompleted?: boolean;
}>(), { orientation: 'horizontal', showCompleted: true });

const wrapperClass = computed(() => cls('av-stepper', `av-stepper-${props.orientation}`));
</script>

<template>
  <div :class="wrapperClass" aria-label="Progress steps">
    <div
      v-for="(step, i) in steps"
      :key="i"
      :class="cls('av-step', i < activeStep && 'av-step-completed', i === activeStep && 'av-step-active')"
      :aria-current="i === activeStep ? 'step' : undefined"
    >
      <div class="av-step-indicator">
        <span v-if="i < activeStep && showCompleted" class="av-step-check" aria-label="Completed">✓</span>
        <slot v-else :name="`icon-${i}`">
          <span class="av-step-number">{{ i + 1 }}</span>
        </slot>
      </div>
      <div class="av-step-content">
        <div class="av-step-label">{{ step.label }}</div>
        <div v-if="step.description" class="av-step-description">{{ step.description }}</div>
      </div>
      <div v-if="i < steps.length - 1" class="av-step-connector" aria-hidden="true" />
    </div>
  </div>
</template>
