import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IAccountItem, IAccountStoreItem, IAccountStoreItemMark } from '@/types/account';

export const useCommonStore = defineStore('commonStore', () => {
  // State
  const accountList = ref<IAccountStoreItem[]>([]);

  // Actions
  const prepareAccountForStore = (account: IAccountItem) => {
    const markList: IAccountStoreItemMark[] = account.mark
      .split(`;`)
      .filter(mark => !!mark.trim())
      .map(mark => ({
        text: mark
      }))
      || [];

    return {
      id: account.id,
      type: account.type,
      login: account.login,
      password: account.type === 'local' ? account.password : null,
      markList,
    }
  };

  const addAccount = (account: IAccountItem) => {
    const processed: IAccountStoreItem = prepareAccountForStore(account);
    accountList.value.push(processed);

    updateDataInSessionStorage();
  };

  const deleteAccount = (id: number) => {
    accountList.value = accountList.value.filter(account => account.id !== id);

    updateDataInSessionStorage();
  };

  const updateAccount = (account: IAccountItem) => {
    const currentAccount = accountList.value.find(accountInList => accountInList.id === account.id);
    const processed: IAccountStoreItem = prepareAccountForStore(account);
    if (currentAccount) {
      Object.assign(currentAccount, processed)
    }

    updateDataInSessionStorage();
  };

  // Getters
  const formattedAccountList = computed((): IAccountItem[] => 
    accountList.value.map(account => {
      const mark = account.markList.reduce<string>((acc, {text}) => {

        const prefix = !acc ? '' : `; `;

        acc += prefix + text;

        return acc;
      },'')

      const processed: IAccountItem = {
        id: account.id,
        type: account.type,
        login: account.login,
        password: account.password || '',
        mark,
      }

      return processed;
    })
  );

  const updateDataInSessionStorage = () => {
    sessionStorage.setItem('accounts', JSON.stringify(accountList.value));
  };

  const loadFromSessionStorage = () => {
    const data = sessionStorage.getItem('accounts');
    if (data) {
      try {
        accountList.value = JSON.parse(data);
      } catch (e) {
        console.error('Ошибка парсинга данных из sessionStorage', e);
      }
    }
  };

  loadFromSessionStorage();

  return {
    // State
    accountList,

    // Actions
    addAccount,
    deleteAccount,
    updateAccount,

    // Getters
    formattedAccountList,
  };
});