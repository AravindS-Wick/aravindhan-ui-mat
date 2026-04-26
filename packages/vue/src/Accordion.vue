<script setup lang="ts">
import { ref, computed } from 'vue';
import { cls } from './types';

export interface AccordionItem {
  id: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  flush?: boolean;
}>(), { defaultOpen: () => [], multiple: false, flush: false });

const open = ref<Set<string>>(new Set(props.defaultOpen));

function toggle(id: string) {
  const next = new Set(open.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    if (!props.multiple) next.clear();
    next.add(id);
  }
  open.value = next;
}

const wrapperClass = computed(() => cls('av-accordion', props.flush && 'av-accordion-flush'));
</script>

<template>
  <div :class="wrapperClass">
    <div
      v-for="item in items"
      :key="item.id"
      :class="cls('av-accordion-item', open.has(item.id) && 'av-accordion-item-open')"
    >
      <button
        type="button"
        class="av-accordion-trigger"
        :aria-expanded="open.has(item.id)"
        :aria-controls="`av-acc-${item.id}`"
        :disabled="item.disabled"
        @click="toggle(item.id)"
      >
        <slot :name="`label-${item.id}`">{{ item.label }}</slot>
        <span class="av-accordion-icon" aria-hidden="true" />
      </button>
      <div
        :id="`av-acc-${item.id}`"
        :class="cls('av-accordion-body', open.has(item.id) && 'av-accordion-body-open')"
        role="region"
      >
        <div class="av-accordion-content">
          <slot :name="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>
