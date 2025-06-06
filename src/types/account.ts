export type AccountType = 'local' | 'ldap';

export type AccountPassword = string | null;

export interface IAccountStoreItemMark {
  text: string;
}

export interface IAccountCommonData {
  id: number;
  type: AccountType;
  login: string;
}

export interface IAccountItem extends IAccountCommonData {
  mark: string;
  password: string;
}

export interface IAccountStoreItem extends IAccountCommonData {
  markList: IAccountStoreItemMark[];
  password: AccountPassword;
}