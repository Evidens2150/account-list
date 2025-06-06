<template>
  <div class="input-wrapper">
    <input
      v-model="model"
      :type="currentInputType"
      :placeholder="placeholder"
      autocomplete="new-password"
      class="input"
      :class="{'input--required': required}"
      :maxlength="maxlength"
      @blur="emit('blur')"
    />
    <v-button
      v-if="isPasswordInput"
      class="input__button"
      @click="togglePasswordVisibility"
    >
      <eye-off-icon v-if="isPasswordVisible" />
      <eye-icon v-else />
    </v-button>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed, toRefs, withDefaults, defineProps, defineModel, defineEmits } from 'vue';
// Components
import VButton from '@/components/common/VButton.vue';
import EyeIcon from '@/components/common/icons/EyeIcon.vue';
import EyeOffIcon from '@/components/common/icons/EyeOffIcon.vue';
// Types
import { IInputProps, InputType } from '@/types/input';

// Props
const props = withDefaults(defineProps<IInputProps>(), {
  type: 'text',
  placeholder: '',
  required: false,
  maxlength: 100,
});

const { 
  type,
  placeholder,
  required,
  maxlength,
} = toRefs(props);

// Model
const model = defineModel<string>();

// Emit
const emit = defineEmits<{
  (e: 'blur'): void
}>();

// Data
const currentInputType = ref<InputType>(type.value);

// Computed
const isPasswordInput = computed((): boolean => type.value === 'password');
const isPasswordVisible = computed((): boolean => currentInputType.value === 'text');

// Methods
const togglePasswordVisibility = () => {
  if (isPasswordVisible.value) {
    currentInputType.value = 'password';
    return
  }

  currentInputType.value = 'text';
}
</script>

<style lang='scss'>
.input-wrapper {
  position: relative;
  display: flex;
}

.input {
  width: 100%;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid gray;

  &--required {
    border-color: red;
  }
}

.input__button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;

  padding: 2px;
}
</style>