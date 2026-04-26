<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

const props = withDefaults(defineProps<{
  columns: TableColumn[];
  data: Record<string, unknown>[];
  rowKey?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  bordered?: boolean;
  loading?: boolean;
  emptyText?: string;
  stickyHeader?: boolean;
  responsive?: boolean;
}>(), { striped: false, hoverable: true, compact: false, bordered: false, loading: false, emptyText: 'No data', stickyHeader: false, responsive: true });

const tableClass = computed(() =>
  cls('av-table', props.striped && 'av-table-striped', props.hoverable && 'av-table-hover',
    props.compact && 'av-table-compact', props.bordered && 'av-table-bordered', props.stickyHeader && 'av-table-sticky')
);
</script>

<template>
  <div :class="cls(responsive && 'av-table-responsive')">
    <table :class="tableClass">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width, textAlign: col.align }" scope="col">
            <slot :name="`header-${col.key}`">{{ col.header }}</slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="av-table-loading">
            <span class="av-spinner av-spinner-border av-spinner-primary av-spinner-sm" role="status" aria-label="Loading" />
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="av-table-empty">{{ emptyText }}</td>
        </tr>
        <tr v-else v-for="(row, i) in data" :key="rowKey ? String(row[rowKey]) : i">
          <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align }">
            <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row" :index="i">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
