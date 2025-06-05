<template>
  <select
    v-model="model"
    class="select"
    @change="emit('change')"
  >
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.value"
      class="select__option"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang='ts'>
// Modules
import { toRefs, withDefaults, defineProps, defineModel, defineEmits } from 'vue';
// Types
import {
  ISelectProps,
  SelectValue,
} from '@/types/select';

// Props
const props = withDefaults(defineProps<ISelectProps>(), {
  options: () => ([]),
});

const { options } = toRefs(props);

// Emit
const emit = defineEmits<{
  (e: 'change'): void
}>();

// Model
const model = defineModel<SelectValue>();
</script>

<style lang='scss'>
.select {
  padding: 10px;

  background-color: white;
  border-radius: 8px;
  border: 1px solid gray;


  &__option {
    cursor: pointer;
  }
}
</style>