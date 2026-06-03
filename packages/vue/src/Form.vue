<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';

const props = withDefaults(defineProps<{
  vertical?: boolean;
}>(), {
  vertical: true,
});

const emit = defineEmits<{ submit: [e: Event] }>();

const className = computed(() => cls(props.vertical && 'av-form-vertical'));
</script>

<template>
  <form
    :class="className"
    noValidate
    @submit="emit('submit', $event)"
  >
    <slot />
  </form>
</template>
