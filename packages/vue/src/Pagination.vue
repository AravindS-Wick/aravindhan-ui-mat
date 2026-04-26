<script setup lang="ts">
import { computed } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  total: number;
  page: number;
  siblings?: number;
  size?: Size;
  showBoundary?: boolean;
  ariaLabel?: string;
}>(), { siblings: 2, showBoundary: false, ariaLabel: 'Pagination' });

const emit = defineEmits<{ 'page-change': [page: number] }>();

const pages = computed(() => {
  const half = Math.floor(props.siblings / 2);
  let start = Math.max(1, props.page - half);
  let end = Math.min(props.total, start + props.siblings - 1);
  if (end - start + 1 < props.siblings) start = Math.max(1, end - props.siblings + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const paginationClass = computed(() => cls('av-pagination', props.size && `av-pagination-${props.size}`));
</script>

<template>
  <nav :aria-label="ariaLabel">
    <ul :class="paginationClass">
      <li v-if="showBoundary" :class="cls('av-page-item', page === 1 && 'av-page-item-disabled')">
        <button type="button" class="av-page-link" :disabled="page === 1" @click="emit('page-change', 1)">«</button>
      </li>
      <li :class="cls('av-page-item', page === 1 && 'av-page-item-disabled')">
        <button type="button" class="av-page-link" :disabled="page === 1" @click="emit('page-change', page - 1)">‹</button>
      </li>
      <template v-if="pages[0] > 1">
        <li class="av-page-item">
          <button type="button" class="av-page-link" @click="emit('page-change', 1)">1</button>
        </li>
        <li v-if="pages[0] > 2" class="av-page-item av-page-item-ellipsis">
          <span class="av-page-link">…</span>
        </li>
      </template>
      <li v-for="p in pages" :key="p" :class="cls('av-page-item', p === page && 'av-page-item-active')">
        <button type="button" class="av-page-link" :aria-current="p === page ? 'page' : undefined" @click="emit('page-change', p)">{{ p }}</button>
      </li>
      <template v-if="pages[pages.length - 1] < total">
        <li v-if="pages[pages.length - 1] < total - 1" class="av-page-item av-page-item-ellipsis">
          <span class="av-page-link">…</span>
        </li>
        <li class="av-page-item">
          <button type="button" class="av-page-link" @click="emit('page-change', total)">{{ total }}</button>
        </li>
      </template>
      <li :class="cls('av-page-item', page === total && 'av-page-item-disabled')">
        <button type="button" class="av-page-link" :disabled="page === total" @click="emit('page-change', page + 1)">›</button>
      </li>
      <li v-if="showBoundary" :class="cls('av-page-item', page === total && 'av-page-item-disabled')">
        <button type="button" class="av-page-link" :disabled="page === total" @click="emit('page-change', total)">»</button>
      </li>
    </ul>
  </nav>
</template>
