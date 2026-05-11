import { IUser } from './user';
import { IBaseEntity } from './utils';

export interface IRole extends IBaseEntity {
  name?: string;
  permissions?: string[];
  users?: IUser[];
}

// Action
export interface IRoleCreate {
  name: string;
}

export interface IRoleUpdate extends IRoleCreate {
  id: string;
}

export interface IPermissionUpdate {
  key: string;
}
