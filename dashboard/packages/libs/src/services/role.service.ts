import { AxiosInstance } from 'axios';

import { roleEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindMany,
  IFindManyResponse,
  IRole,
  IRoleCreate,
  IRoleUpdate,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class RoleServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getRoles(
    filters?: IFindMany,
  ): Promise<IFindManyResponse<IRole>> {
    const res = await this._client.request({
      url: roleEndpoints.getRoles.path,
      method: roleEndpoints.getRoles.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IRole>>(res);
  }

  public async getRoleById(id: string): Promise<IRole> {
    const res = await this._client.request({
      url: roleEndpoints.findOneById.path.replace('{id}', id),
      method: roleEndpoints.findOneById.method,
    });

    return requireApiResponse<IRole>(res);
  }

  public async createRole(data: IRoleCreate): Promise<IRole> {
    const res = await this._client.request({
      url: roleEndpoints.createRole.path,
      method: roleEndpoints.createRole.method,
      data,
    });

    return requireApiResponse<IRole>(res);
  }

  public async updateRole(data: IRoleUpdate): Promise<IRole> {
    const { id, ...body } = data;
    const res = await this._client.request({
      url: roleEndpoints.update.path.replace('{id}', id),
      method: roleEndpoints.update.method,
      data: body,
    });

    return requireApiResponse<IRole>(res);
  }

  public async deleteRole(id: string): Promise<IRole> {
    const res = await this._client.request({
      url: roleEndpoints.delete.path.replace('{id}', id),
      method: roleEndpoints.delete.method,
    });
    return requireApiResponse<IRole>(res);
  }

  public async getPermissions(): Promise<string[]> {
    const res = await this._client.request({
      url: roleEndpoints.getPermissions.path,
      method: roleEndpoints.getPermissions.method,
    });
    return requireApiResponse<string[]>(res);
  }

  public async addPermission(id: string, permission: string): Promise<IRole> {
    const res = await this._client.request({
      url: roleEndpoints.addPermission.path.replace('{id}', id),
      method: roleEndpoints.addPermission.method,
      data: { permission },
    });
    return requireApiResponse<IRole>(res);
  }

  public async removePermission(
    id: string,
    permission: string,
  ): Promise<IRole> {
    const res = await this._client.request({
      url: roleEndpoints.removePermission.path.replace('{id}', id),
      method: roleEndpoints.removePermission.method,
      data: { permission },
    });
    return requireApiResponse<IRole>(res);
  }

  public async syncPermissions(permissions: string[]): Promise<boolean> {
    const res = await this._client.request({
      url: roleEndpoints.syncPermissions.path,
      method: roleEndpoints.syncPermissions.method,
      data: { permissions },
    });
    return requireApiResponse<boolean>(res);
  }
}
