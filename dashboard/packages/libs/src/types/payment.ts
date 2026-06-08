import { IUser } from './user';
import { EStatusProcess, IBaseEntity, IFindMany } from './utils';

export enum EPaymentType {
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOMO = 'MOMO',
}

export interface IPayment extends IBaseEntity {
  uniqueId?: string;
  userId?: string;
  user?: IUser;
  amount?: number;
  price?: number;
  type?: EPaymentType;
  status?: EStatusProcess;
  bankCode?: string;
  doneAt?: Date;
  content?: string;
}

export interface IPaymentFindMany extends IFindMany {
  userId?: string;
  type?: EPaymentType;
  status?: EStatusProcess;
  amount_gte?: number;
  amount_lte?: number;
  price_gte?: number;
  price_lte?: number;
  createdAt_gte?: Date;
  createdAt_lte?: Date;
  updatedAt_gte?: Date;
  updatedAt_lte?: Date;
}

export interface IPaymentCreate {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  type: EPaymentType;
  amount: number;
  price: number;
  bankCode?: string;
  content?: string;
}

export interface IPaymentUpdate extends Partial<IPaymentCreate> {
  status?: EStatusProcess;
}

export interface IPaymentSummary {
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
}
