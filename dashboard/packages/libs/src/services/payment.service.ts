import { AxiosInstance } from 'axios';

import { paymentEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindManyResponse,
  IPayment,
  IPaymentCreate,
  IPaymentFindMany,
  IPaymentSummary,
  IPaymentUpdate,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class PaymentServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getPayments(
    filters?: IPaymentFindMany,
  ): Promise<IFindManyResponse<IPayment>> {
    const res = await this._client.request({
      url: paymentEndpoints.findMany.path,
      method: paymentEndpoints.findMany.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IPayment>>(res);
  }

  public async getSummary(
    filters?: IPaymentFindMany,
  ): Promise<IPaymentSummary> {
    const res = await this._client.request({
      url: paymentEndpoints.getSummary.path,
      method: paymentEndpoints.getSummary.method,
      params: removeNullObject(filters || {}),
    });
    return requireApiResponse<IPaymentSummary>(res);
  }

  public async getPayment(id: string): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.findOne.path.replace('{id}', id),
      method: paymentEndpoints.findOne.method,
    });

    return requireApiResponse<IPayment>(res);
  }

  public async approvePayment(id: string): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.approve.path.replace('{id}', id),
      method: paymentEndpoints.approve.method,
    });

    return requireApiResponse<IPayment>(res);
  }

  public async rejectPayment(id: string, reason: string): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.reject.path.replace('{id}', id),
      method: paymentEndpoints.reject.method,
      data: { reason },
    });

    return requireApiResponse<IPayment>(res);
  }

  public async reopenPayment(id: string, reason: string): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.reopen.path.replace('{id}', id),
      method: paymentEndpoints.reopen.method,
      data: { reason },
    });

    return requireApiResponse<IPayment>(res);
  }

  public async createPayment(data: IPaymentCreate): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.create.path,
      method: paymentEndpoints.create.method,
      data,
    });

    return requireApiResponse<IPayment>(res);
  }

  public async updatePayment(
    id: string,
    data: IPaymentUpdate,
  ): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.update.path.replace('{id}', id),
      method: paymentEndpoints.update.method,
      data,
    });

    return requireApiResponse<IPayment>(res);
  }

  public async cancelPayment(id: string): Promise<IPayment> {
    const res = await this._client.request({
      url: paymentEndpoints.cancel.path.replace('{id}', id),
      method: paymentEndpoints.cancel.method,
    });

    return requireApiResponse<IPayment>(res);
  }
}
