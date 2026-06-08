import { AxiosInstance } from 'axios';

import { notificationEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindManyResponse,
  INotification,
  INotificationFindMany,
  INotificationStats,
  INotificationSystem,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class NotificationServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getNotifications(
    data?: INotificationFindMany,
  ): Promise<IFindManyResponse<INotification>> {
    const res = await this._client.request({
      url: notificationEndpoints.findMany.path,
      method: notificationEndpoints.findMany.method,
      ...(data && { params: removeNullObject(data) }),
    });

    return requireApiResponse<IFindManyResponse<INotification>>(res);
  }

  public async getStats(): Promise<INotificationStats> {
    const res = await this._client.request({
      url: notificationEndpoints.stats.path,
      method: notificationEndpoints.stats.method,
    });

    return requireApiResponse<INotificationStats>(res);
  }

  public async readAll(): Promise<boolean> {
    const res = await this._client.request({
      url: notificationEndpoints.readAll.path,
      method: notificationEndpoints.readAll.method,
    });

    return requireApiResponse<boolean>(res);
  }

  public async readOne(id: string): Promise<boolean> {
    const res = await this._client.request({
      url: notificationEndpoints.read.path.replace('{id}', id),
      method: notificationEndpoints.read.method,
    });

    return requireApiResponse<boolean>(res);
  }

  public async getNotificationSystem(): Promise<INotificationSystem> {
    const res = await this._client.request({
      url: notificationEndpoints.getSystems.path,
      method: notificationEndpoints.getSystems.method,
    });

    return requireApiResponse<INotificationSystem>(res);
  }
}
