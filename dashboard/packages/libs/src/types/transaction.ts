import { IUser } from './user';
import { EStatusProcess, IBaseEntity, IFindMany } from './utils';

export enum ETransactionType {
  SYSTEM = 'SYSTEM',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  TRANSFER = 'TRANSFER',
  REWARD = 'REWARD',
  WITHDRAW = 'WITHDRAW',
  CONVERT = 'CONVERT',
}

export const EBalanceType = {
  CREDIT: 'CREDIT',
  COMMISSION: 'COMMISSION',
} as const;

export type EBalanceType = (typeof EBalanceType)[keyof typeof EBalanceType];

export interface ITransaction extends IBaseEntity {
  userId?: string;
  user?: IUser;
  type?: ETransactionType;
  newBalance?: number;
  amount?: number;
  balanceType?: EBalanceType;
  status?: EStatusProcess;
  refId?: string;
}

export interface ITransactionFindMany extends IFindMany {
  userId?: string;
  type?: ETransactionType;
  status?: EStatusProcess;
  balanceType?: EBalanceType;
  amount_gte?: number;
  amount_lte?: number;
  createdAt_gte?: Date;
  createdAt_lte?: Date;
  updatedAt_gte?: Date;
  updatedAt_lte?: Date;
}

export interface ITransactionCreate {
  userId: string;
  type: ETransactionType;
  amount: number;
}

export interface ITransactionUpdate extends Partial<ITransactionCreate> {
  status?: EStatusProcess;
}

export interface ITransactionConvertCommission {
  amount: number;
}
