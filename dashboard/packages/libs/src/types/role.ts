import { IUser } from './user';
import { IBaseEntity } from './utils';

export type IRole = IBaseEntity & {
  name?: string;
  permissions?: string[];
  users?: IUser[];
};

// Action
export type IRoleCreate = {
  name: string;
};

export type IRoleUpdate = IRoleCreate & {
  id: string;
};

export type IPermissionUpdate = {
  key: string;
};
