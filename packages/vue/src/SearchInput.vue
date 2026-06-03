<script setup lang="ts">
import { computed, ref } from 'vue';
import { cls, type Size } from './types';

const props = withDefaults(defineProps<{
  modelValue?: string;
  label?: string;
  size?: Size;
  fullWidth?: boolean;
  debounce?: number;
  clearable?: boolean;
  loading?: boolean;
  id?: string;
}>(), {
  size: 'md',
  fullWidth: false,
  debounce: 0,
  clearable: true,
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'search': [value: string];
  'input': [e: Event];
}>();

const uid = computed(() => props.id ?? `sch-${Math.random().toString(36).slice(2, 7)}`);
const internal = ref('');
const displayValue = computed(() => props.modelValue ?? internal.value);

const inputRef = ref<HTMLInputElement | null>(null);

let timer: ReturnType<typeof setTimeout> | null = null;

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  internal.value = val;
  emit('update:modelValue', val);
  emit('input', e);
  
  if (timer) clearTimeout(timer);
  if (props.debounce > 0) {
    timer = setTimeout(() => emit('search', val), props.debounce);
  } else {
    emit('search', val);
  }
};

const clear = () => {
  internal.value = '';
  emit('update:modelValue', '');
  emit('search', '');
  if (inputRef.value) {
    inputRef.value.value = '';
    inputRef.value.focus();
  }
};
</script>

<template>
  <div :class="cls('av-search-input', fullWidth && 'av-search-input-full')">
    <label v-if="label" :for="uid" class="av-form-label">{{ label }}</label>
    
    <div :class="cls('av-input-wrapper av-input-wrapper-start', displayValue && clearable && 'av-input-wrapper-end')">
      <span class="av-input-adornment av-input-adornment-start" aria-hidden="true">
        <span v-if="loading" class="av-spinner av-spinner-border av-spinner-sm av-spinner-primary" role="status" aria-label="Searching" />
        <span v-else class="av-search-icon">🔍</span>
      </span>
      
      <input
        ref="inputRef"
        :id="uid"
        type="search"
        :class="cls('av-input', size !== 'md' && `av-input-${size}`)"
        :value="displayValue"
        autocomplete="off"
        @input="onInput"
      />
      
      <span v-if="clearable && displayValue" class="av-input-adornment av-input-adornment-end">
        <button type="button" class="av-search-clear" aria-label="Clear search" @click="clear">
          &times;
        </button>
      </span>
    </div>
  </div>
</template>
