export type AccountType = 'local' | 'ldap';

export type AccountPassword = string | null;

export interface IAccountStoreItemMark {
  text: string;
}

export interface IAccountCommonData {
  id: number;
  type: AccountType;
  login: string;
  password: AccountPassword;
}

export interface IAccountItem extends IAccountCommonData {
  mark: string;
}

export interface IAccountStoreItem extends IAccountCommonData {
  markList: IAccountStoreItemMark[];
}