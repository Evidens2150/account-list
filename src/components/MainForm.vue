<template>
  <div class="main-form">
    <div>{{ accountListOrigin }}</div>
    <div class="main-form__header">
      <h2 class="main-form__title">Учетные записи</h2>
      <v-button
        :disabled="createButtonDisabled"
        :title="createButtonTitle"
        @click="createAccount"
      >
        <add-icon />
      </v-button>
    </div>

    <div class="main-form__hint">
      <help-icon class="main-form__help-icon" />
      <p class="main-form__hint-text">{{ mainFormHint }}</p>
    </div>

    <ul class="main-form__account-list-header">
      <li
        v-for="(heading, index) in headingList"
        :key="index"
      >
        {{ heading }}
      </li>
    </ul>

    <ul
      v-if="isAccountList"
      class="account-list"
    >
      <li
        v-for="account in accountList"
        :key="account.id"
        class="account-item"
      >
        <accout-item
          v-bind="account"
          @delete-account="handleDeleteAccount(account.id)"
        />
      </li>
      <li v-if="newAccount">
        <accout-item
          v-bind="newAccount"
          @create-complete="handleClearNewAccount"
          @delete-account="handleClearNewAccount"
        />
      </li>
    </ul>

    <p
      v-else
      class="main-form__account-list-empty"
    >
      Учетные записи отсутствуют
    </p>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed } from 'vue';
// Components
import VButton from '@/components/common/VButton.vue';
import AddIcon from '@/components/common/icons/AddIcon.vue';
import HelpIcon from '@/components/common/icons/HelpIcon.vue';
import AccoutItem from '@/components/AccoutItem.vue';
// Store
import { useCommonStore } from '@/store';
// Types
import { IAccountItem } from '@/types/account';

// Data
const commonStore = useCommonStore();
const mainFormHint = 'Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;';
const headingList: string[] = [
  'Метки',
  'Тип записи',
  'Логин',
  'Пароль',
];
const newAccount = ref<IAccountItem | null>(null);

// Computed
const accountList = computed((): IAccountItem[] => 
  commonStore.formattedAccountList
);

const isAccountList = computed((): boolean => 
  !!accountList.value.length || !!newAccount.value
);

const accountListOrigin = computed((): any[] => 
  commonStore.accountList
);

const isCreationNotComplete = computed((): boolean => {
  if (!newAccount.value) return false;

  return !newAccount.value.login || (newAccount.value.type === 'local' && !newAccount.value.password)
});

const createButtonDisabled = computed((): boolean =>
  accountList.value.some(account => !account.login || (account.type === 'local' && !account.password))
  || isCreationNotComplete.value
);

const createButtonTitle = computed((): string => {
  if (isCreationNotComplete.value) {
    return 'Необходимо завершить создание учётной записи'
  }

  return createButtonDisabled.value
    ? 'Необходимо исправить данные учётной записи'
    : 'Добавить учетную запись'
});

// Methods
const createAccount = () => {
  newAccount.value = {
    id: Date.now(),
    mark: '',
    type: 'local',
    login: '',
    password: '',
  }
};

const handleClearNewAccount = () => {
  newAccount.value = null;
};

const handleDeleteAccount = (accountId: number) => {
  commonStore.deleteAccount(accountId);
};
</script>

<style lang='scss'>
.main-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}


.main-form__header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 16px;
}

.main-form__title {
  font-size: 24px;
  font-weight: bold;
}

.main-form__hint {
  display: flex;
  align-items: center;
  background-color: #f0f4f8;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.main-form__help-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.main-form__hint-text,
.main-form__account-list-empty {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.main-form__account-list-empty {
  text-align: center;
}

.main-form__account-list-header {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr)) 40px;
  background-color: #e0e0e0;
  padding: 8px;
  border-radius: 4px;
  list-style-type: none;
  gap: 8px;
  font-weight: bold;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;

  list-style-type: none;
}
</style>