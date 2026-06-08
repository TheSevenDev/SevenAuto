import { AxiosInstance } from 'axios';

import { websocketEndpoints } from '../constants/endpoints/mainApiEndpoints';
import { IWebsocketOnlineUser } from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class WebsocketServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getOnlineUsers(params: IWebsocketOnlineUser): Promise<string[]> {
    const res = await this._client.request({
      url: websocketEndpoints.getOnlineUsers.path,
      method: websocketEndpoints.getOnlineUsers.method,
      params: removeNullObject({ userIds: params.userIds }),
    });

    return requireApiResponse<string[]>(res);
  }

  public async sendSystemNotification(data: {
    userIds?: string[];
    message: string;
    type?: string;
  }): Promise<string> {
    const res = await this._client.request({
      url: websocketEndpoints.sendSystemNotification.path,
      method: websocketEndpoints.sendSystemNotification.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<string>(res);
  }
}
