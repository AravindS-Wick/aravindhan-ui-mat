<script setup lang="ts">
import { computed } from 'vue';
import { cls } from './types';
import { useFieldProps } from './FormProvider';

const props = withDefaults(defineProps<{
  modelValue?: any;
  checked?: boolean;
  label?: string;
  inputType?: 'checkbox' | 'radio';
  toggle?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  value?: any;
}>(), {
  inputType: 'checkbox',
  toggle: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: any];
  'change': [e: Event];
}>();

const uid = computed(() => props.id ?? `fc-${Math.random().toString(36).slice(2, 7)}`);
const fieldProps = useFieldProps(props);

const wrapperClass = computed(() =>
  cls(
    'av-form-check',
    props.toggle && 'av-form-switch'
  )
);

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    if (props.inputType === 'radio') {
      return props.modelValue === props.value;
    }
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value);
    }
    return Boolean(props.modelValue);
  }
  return props.checked;
});

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (props.inputType === 'radio') {
    emit('update:modelValue', props.value);
  } else {
    if (Array.isArray(props.modelValue)) {
      const copy = [...props.modelValue];
      if (target.checked) {
        copy.push(props.value);
      } else {
        const idx = copy.indexOf(props.value);
        if (idx > -1) copy.splice(idx, 1);
      }
      emit('update:modelValue', copy);
    } else {
      emit('update:modelValue', target.checked);
    }
  }
  emit('change', e);
};
</script>

<template>
  <div :class="wrapperClass">
    <input
      :id="uid"
      :type="inputType"
      :role="toggle ? 'switch' : undefined"
      class="av-form-check-input"
      :checked="isChecked"
      :disabled="fieldProps.disabled"
      :required="fieldProps.required"
      @change="onChange"
    />
    <label v-if="label" class="av-form-check-label" :for="uid">
      {{ label }}
    </label>
  </div>
</template>
