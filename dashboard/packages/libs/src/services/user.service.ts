import { AxiosInstance } from 'axios';

import { userEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindManyResponse,
  IUser,
  IUserCreate,
  IUserFindMany,
  IUserStats,
  IUserUpdate,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class UserServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getUsers(
    filters?: IUserFindMany,
  ): Promise<IFindManyResponse<IUser>> {
    const res = await this._client.request({
      url: userEndpoints.findMany.path,
      method: userEndpoints.findMany.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IUser>>(res);
  }

  public async getCount(query?: IUserFindMany): Promise<number> {
    const res = await this._client.request({
      url: userEndpoints.countUsers.path,
      method: userEndpoints.countUsers.method,
      params: removeNullObject(query || {}),
    });

    return requireApiResponse<number>(res);
  }

  public async getUserStats(id: string): Promise<IUserStats> {
    const res = await this._client.request({
      url: userEndpoints.findStats.path.replace('{id}', id),
      method: userEndpoints.findStats.method,
    });

    return requireApiResponse<IUserStats>(res);
  }

  public async getUserById(id: string): Promise<IUser> {
    const res = await this._client.request({
      url: userEndpoints.findOne.path.replace('{id}', id),
      method: userEndpoints.findOne.method,
    });

    return requireApiResponse<IUser>(res);
  }

  public async createUser(data: IUserCreate): Promise<IUser> {
    const res = await this._client.request({
      url: userEndpoints.create.path,
      method: userEndpoints.create.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<IUser>(res);
  }

  public async updateUser(data: IUserUpdate): Promise<IUser> {
    const { id } = data;
    const res = await this._client.request({
      url: userEndpoints.update.path.replace('{id}', id),
      method: userEndpoints.update.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<IUser>(res);
  }

  public async deleteUser(id: string): Promise<IUser> {
    const res = await this._client.request({
      url: userEndpoints.delete.path.replace('{id}', id),
      method: userEndpoints.delete.method,
    });
    return requireApiResponse<IUser>(res);
  }

  public async deleteManyUser(ids: string[]): Promise<IUser[]> {
    const res = await this._client.request({
      url: userEndpoints.deleteMany.path,
      method: userEndpoints.deleteMany.method,
      data: { ids },
    });
    return requireApiResponse<IUser[]>(res);
  }

  public async getUserByUsername(username: string): Promise<IUser> {
    const res = await this._client.request({
      url: userEndpoints.findOneByUsername.path.replace('{username}', username),
      method: userEndpoints.findOneByUsername.method,
    });

    return requireApiResponse<IUser>(res);
  }
}
