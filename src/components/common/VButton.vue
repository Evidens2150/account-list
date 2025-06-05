<template>
  <button
    :disabled="disabled"
    :title="title"
    type="button"
    class="button"
    @click.prevent="handleClick"
  >
    <slot>
      Применить
    </slot>
  </button>
</template>

<script setup lang="ts">
// Modules
import { toRefs, withDefaults, defineProps, defineEmits } from 'vue';
// Types
import { IButtonProps } from '@/types/button';

// Props
const props = withDefaults(defineProps<IButtonProps>(), {
  disabled: false,
  title: '',
});

const {
  disabled,
  title,
} = toRefs(props);

// Emit
const emit = defineEmits<{
  (e: 'click'): void
}>()

// Methods
const handleClick = () => {
  emit('click');
};
</script>

<style lang='scss'>
.button {
  padding: 10px;

  background-color: white;
  border-radius: 8px;
  border: 1px solid gray;

  transition: all .3s linear;

  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
    border-color: #999;
  }

  &:active:not(:disabled) {
    background-color: #e0e0e0;
    border-color: #666;
    transform: translateY(1px);
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}
</style>