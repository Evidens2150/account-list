<template>
  <div class="account">
    <v-input
      v-model="currentAccount.mark"
      class="account__cell"
      :maxlength="50"
      @blur="validateForm"
    />
    <v-select
      v-model="currentAccount.type"
      :options="accountTypeOptionList"
      class="account__cell"
      @change="validateForm"
    />
    <v-input
      v-model="currentAccount.login"
      :required="errors.login"
      class="account__cell"
      :class="{ 'account__cell--double-width': !isPassword }"
      @blur="validateForm"
    />
    <v-input
      v-if="isPassword"
      v-model="currentAccount.password"
      :required="errors.password"
      type="password"
      class="account__cell"
      @blur="validateForm"
    />
    <v-button
      title="Удалить учетную запись"
      @click="deleteAccount"
    >
      <trash-icon />
    </v-button>
  </div>
</template>

<script setup lang="ts">
// Modules
import { computed, reactive, toRefs, watch, defineProps, defineEmits } from 'vue';
// Components
import VInput from '@/components/common/VInput.vue';
import VSelect from '@/components/common/VSelect.vue';
import VButton from '@/components/common/VButton.vue';
import TrashIcon from '@/components/common/icons/TrashIcon.vue';
// Types
import { IAccountItem } from '@/types/account';
import { ISelectOption } from '@/types/select';
// Store
import { useCommonStore } from '@/store';

// Props
const props = defineProps<IAccountItem>();

const {
  id,
  mark,
  type,
  login,
  password,
} = toRefs(props);

// Emit
const emit = defineEmits<{
  (e: 'create-complete', value: IAccountItem): void;
  (e: 'delete-account', value: number): void;
}>();

// Data
const commonStore = useCommonStore();
const accountTypeOptionList: ISelectOption[] = [
  {
    label: 'Локальная',
    value: 'local',
  },
  {
    label: 'LDAP',
    value: 'ldap',
  },
];
const errors = reactive<{ [key: string]: boolean }>({});

// Computed
const isPassword = computed((): boolean => currentAccount.type === 'local');

const currentAccount = reactive<IAccountItem>({
  id: id.value,
  mark: mark.value,
  type: type.value,
  login: login.value,
  password: password.value,
});

// Watchers
watch(
  () => currentAccount,
  (newValue) => {
    commonStore.updateAccount(newValue)
  },
  { deep: true }
);

watch(
  () => password.value,
  (newValue) => {
    currentAccount.password = newValue || '';
  } 
);

// Methods
const deleteAccount = () => {
  emit('delete-account', id.value);
};

const validateForm = () => {
  const fieldList: string[] = Object.keys(currentAccount);

  fieldList.forEach(field => validateField(field));

  const isFormValid: boolean = Object.values(errors).every(value => !value);

  if (isFormValid) {
    emit('create-complete', currentAccount);
  }
};

const validateField = (field: string) => {
  switch (field) {
    case 'login':
      errors.login = !currentAccount.login.trim();
      break;
    case 'password':
      errors.password = !isPassword.value
        ? false
        : !currentAccount.password || currentAccount.password.trim() === '';
      break;
  }
}
</script>

<style lang='scss'>
.account {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  gap: 8px;
}

.account__cell--double-width {
  grid-column: span 2;
}
</style>