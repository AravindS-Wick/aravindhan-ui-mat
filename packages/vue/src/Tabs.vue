<script setup lang="ts">
import { ref, computed } from 'vue';
import { cls } from './types';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  items: TabItem[];
  modelValue?: string;
  defaultTab?: string;
  variant?: 'tabs' | 'pills' | 'underline';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  fill?: boolean;
  justified?: boolean;
}>(), { variant: 'tabs', placement: 'top', fill: false, justified: false });

const emit = defineEmits<{ 'update:modelValue': [id: string] }>();

const internal = ref(props.defaultTab ?? props.items[0]?.id ?? '');
const active = computed(() => props.modelValue ?? internal.value);

function select(id: string) {
  internal.value = id;
  emit('update:modelValue', id);
}

const navClass = computed(() =>
  cls('av-tabs', `av-tabs-${props.variant}`, props.fill && 'av-tabs-fill', props.justified && 'av-tabs-justified',
    props.placement !== 'top' && `av-tabs-${props.placement}`)
);
</script>

<template>
  <div :class="cls('av-tabs-wrapper', `av-tabs-wrapper-${placement}`)">
    <div role="tablist" :class="navClass">
      <button
        v-for="tab in items"
        :key="tab.id"
        type="button"
        role="tab"
        :id="`av-tab-${tab.id}`"
        :aria-controls="`av-tabpanel-${tab.id}`"
        :aria-selected="active === tab.id"
        :class="cls('av-tab', active === tab.id && 'av-tab-active', tab.disabled && 'av-tab-disabled')"
        :disabled="tab.disabled"
        :tabindex="active === tab.id ? 0 : -1"
        @click="!tab.disabled && select(tab.id)"
      >
        <slot :name="`icon-${tab.id}`" />
        {{ tab.label }}
      </button>
    </div>
    <div class="av-tab-panels">
      <div
        v-for="tab in items"
        :key="tab.id"
        :id="`av-tabpanel-${tab.id}`"
        role="tabpanel"
        :aria-labelledby="`av-tab-${tab.id}`"
        :class="cls('av-tab-panel', active === tab.id && 'av-tab-panel-active')"
        :hidden="active !== tab.id"
      >
        <slot :name="tab.id" />
      </div>
    </div>
  </div>
</template>
