import { AxiosInstance } from 'axios';

import { mediaEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindManyResponse,
  IMedia,
  IMediaFindMany,
  IMediaUpdate,
} from '../types';
import { generateMediaSignature } from '../utils';
import { removeNullObject, requireApiResponse } from './utils';

export class MediaServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getMedias(
    filters?: IMediaFindMany,
  ): Promise<IFindManyResponse<IMedia>> {
    const res = await this._client.request({
      url: mediaEndpoints.findMany.path,
      method: mediaEndpoints.findMany.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IMedia>>(res);
  }

  public async getMediaById(id: string): Promise<IMedia> {
    const res = await this._client.request({
      url: mediaEndpoints.findOneById.path.replace('{id}', id),
      method: mediaEndpoints.findOneById.method,
    });

    return requireApiResponse<IMedia>(res);
  }

  public async createMedia(file: File, mediaSecret: string): Promise<IMedia> {
    const data = new FormData();
    const signature = generateMediaSignature(file.name, mediaSecret);
    data.append('file', file);
    data.append('signature', signature);
    data.append('key', file.name);

    const res = await this._client.request({
      url: mediaEndpoints.upload.path,
      method: mediaEndpoints.upload.method,
      data,
    });

    return requireApiResponse<IMedia>(res);
  }

  public async updateMedia(data: IMediaUpdate): Promise<IMedia> {
    const body = new FormData();
    if (data.file) body.append('file', data.file);
    if (data.title) body.append('title', data.title);
    if (data.alt) body.append('alt', data.alt);
    if (data.hash) body.append('hash', data.hash);

    const res = await this._client.request({
      url: mediaEndpoints.update.path.replace('{id}', data.id),
      method: mediaEndpoints.update.method,
      data: body,
    });
    return requireApiResponse<IMedia>(res);
  }

  public async deleteMedia(id: string): Promise<IMedia> {
    const res = await this._client.request({
      url: mediaEndpoints.delete.path.replace('{id}', id),
      method: mediaEndpoints.delete.method,
    });
    return requireApiResponse<IMedia>(res);
  }

  public async deleteManyMedia(ids: string[]): Promise<IMedia[]> {
    const res = await this._client.request({
      url: mediaEndpoints.deleteMany.path,
      method: mediaEndpoints.deleteMany.method,
      data: { ids },
    });
    return requireApiResponse<IMedia[]>(res);
  }

  public async uploadFromUrl(url: string): Promise<IMedia> {
    const res = await this._client.request({
      url: mediaEndpoints.uploadFromUrl.path,
      method: mediaEndpoints.uploadFromUrl.method,
      data: { url },
    });
    return requireApiResponse<IMedia>(res);
  }

  public async saveInfoUnsplash(data: {
    url: string;
    key: string;
    title?: string;
    alt?: string;
  }): Promise<IMedia> {
    const res = await this._client.request({
      url: mediaEndpoints.saveInfoUnsplash.path,
      method: mediaEndpoints.saveInfoUnsplash.method,
      data,
    });
    return requireApiResponse<IMedia>(res);
  }

  public async removeMediaNotUsed(): Promise<number> {
    const res = await this._client.request({
      url: mediaEndpoints.removeMediaNotUsed.path,
      method: mediaEndpoints.removeMediaNotUsed.method,
    });
    return requireApiResponse<number>(res);
  }
}
