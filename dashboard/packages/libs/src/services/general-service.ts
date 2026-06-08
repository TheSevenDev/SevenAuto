import { AxiosInstance } from 'axios';

import { apiEndpoints } from '../constants/endpoints';
import { ELanguage, ISeedData, ISiteInfo } from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class GeneralServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getSiteInfo(
    language: ELanguage = ELanguage.VI,
  ): Promise<ISiteInfo> {
    const res = await this._client.request({
      url: apiEndpoints.general.getSiteInfo.path,
      method: apiEndpoints.general.getSiteInfo.method,
      params: { language },
    });
    return res.data?.data;
  }

  public async updateSiteInfo(data: Partial<ISiteInfo>): Promise<ISiteInfo> {
    const res = await this._client.request({
      url: apiEndpoints.general.updateSiteInfo.path,
      method: apiEndpoints.general.updateSiteInfo.method,
      data,
    });
    return res.data?.data;
  }

  public async getStatus(): Promise<{ status: string }> {
    const res = await this._client.request({
      url: apiEndpoints.general.status.path,
      method: apiEndpoints.general.status.method,
    });
    return requireApiResponse<{ status: string }>(res);
  }

  public async seedData(query?: ISeedData): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.general.seedData.path,
      method: apiEndpoints.general.seedData.method,
      params: removeNullObject(query || {}),
    });
    return requireApiResponse<boolean>(res);
  }
}
