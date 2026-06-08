import { AxiosInstance } from 'axios';

import { apiEndpoints } from '../constants/endpoints';
import {
  EEmailTemplateKey,
  IEmailTemplate,
  IEmailTemplateUpdate,
  IFindMany,
  IFindManyResponse,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class EmailTemplateServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getEmailTemplates(
    query?: IFindMany,
  ): Promise<IFindManyResponse<IEmailTemplate>> {
    const res = await this._client.request({
      url: apiEndpoints.emailTemplate.findMany.path,
      method: apiEndpoints.emailTemplate.findMany.method,
      params: removeNullObject(query || {}),
    });

    return requireApiResponse<IFindManyResponse<IEmailTemplate>>(res);
  }

  public async getEmailTemplate(id: string): Promise<IEmailTemplate> {
    const res = await this._client.request({
      url: apiEndpoints.emailTemplate.findOne.path.replace('{id}', id),
      method: apiEndpoints.emailTemplate.findOne.method,
    });

    return requireApiResponse<IEmailTemplate>(res);
  }

  public async updateEmailTemplate(
    data: IEmailTemplateUpdate,
  ): Promise<IEmailTemplate> {
    const { id, ...body } = data;
    const res = await this._client.request({
      url: apiEndpoints.emailTemplate.update.path.replace('{id}', id),
      method: apiEndpoints.emailTemplate.update.method,
      data: body,
    });

    return requireApiResponse<IEmailTemplate>(res);
  }

  public async getEmailTemplateByKey(
    key: EEmailTemplateKey,
  ): Promise<IEmailTemplate> {
    const res = await this._client.request({
      url: apiEndpoints.emailTemplate.findOneByKey.path.replace('{key}', key),
      method: apiEndpoints.emailTemplate.findOneByKey.method,
    });

    return requireApiResponse<IEmailTemplate>(res);
  }
}
