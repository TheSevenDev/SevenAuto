import { AxiosInstance } from 'axios';

import { transactionEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindManyResponse,
  ITransaction,
  ITransactionConvertCommission,
  ITransactionCreate,
  ITransactionFindMany,
  ITransactionUpdate,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class TransactionServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getTransaction(id: string): Promise<ITransaction[]> {
    const res = await this._client.request({
      url: transactionEndpoints.findOne.path.replace('{id}', id),
      method: transactionEndpoints.findOne.method,
    });

    return requireApiResponse<ITransaction[]>(res);
  }

  public async getTransactions(
    query: ITransactionFindMany,
  ): Promise<IFindManyResponse<ITransaction>> {
    const res = await this._client.request({
      url: transactionEndpoints.findMany.path,
      method: transactionEndpoints.findMany.method,
      ...(query && { params: removeNullObject(query) }),
    });

    return requireApiResponse<IFindManyResponse<ITransaction>>(res);
  }

  public async createTransaction(
    data: ITransactionCreate,
  ): Promise<ITransaction> {
    const res = await this._client.request({
      url: transactionEndpoints.create.path,
      method: transactionEndpoints.create.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<ITransaction>(res);
  }

  public async updateTransaction(
    id: string,
    data: ITransactionUpdate,
  ): Promise<ITransaction> {
    const res = await this._client.request({
      url: transactionEndpoints.update.path.replace('{id}', id),
      method: transactionEndpoints.update.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<ITransaction>(res);
  }

  public async approveTransaction(id: string): Promise<ITransaction> {
    const res = await this._client.request({
      url: transactionEndpoints.approve.path.replace('{id}', id),
      method: transactionEndpoints.approve.method,
    });

    return requireApiResponse<ITransaction>(res);
  }

  public async rejectTransaction(id: string): Promise<ITransaction> {
    const res = await this._client.request({
      url: transactionEndpoints.reject.path.replace('{id}', id),
      method: transactionEndpoints.reject.method,
    });

    return requireApiResponse<ITransaction>(res);
  }

  public async convertCommission(
    data: ITransactionConvertCommission,
  ): Promise<boolean> {
    const res = await this._client.request({
      url: transactionEndpoints.convert.path,
      method: transactionEndpoints.convert.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<boolean>(res);
  }
}
