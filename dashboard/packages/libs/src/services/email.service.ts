import { AxiosInstance } from 'axios';

import { apiEndpoints } from '../constants/endpoints';
import { IEmailSendMulti } from '../types';
import { requireApiResponse } from './utils';

export class EmailServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async sendEmails(data: IEmailSendMulti): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.email.sendEmail.path,
      method: apiEndpoints.email.sendEmail.method,
      data,
    });

    return requireApiResponse<boolean>(res);
  }
}
