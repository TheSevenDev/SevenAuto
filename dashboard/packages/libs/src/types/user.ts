import { IMedia } from './media';
import { IRole } from './role';
import { IFindMany, IOrderBy, ELanguage, IBaseEntity } from './utils';

export interface IUser extends IBaseEntity {
  email?: string;
  fullname?: string;
  username?: string;
  gender?: EUserGender;
  phone?: string;
  country?: string;
  address?: string;
  region?: string;
  city?: string;
  zipCode?: string;
  socials?: string;
  about?: string;
  content?: string;
  isVerified?: boolean;
  status?: EUserStatus;
  deleted?: boolean;
  avatarId?: string;
  avatar?: IMedia;
  roleId?: string;
  role?: IRole;
  referrerId?: string;
  referrer?: IUser;
  language?: ELanguage;
  metas?: IUserMeta[];
}

export interface IUserMeta extends IBaseEntity {
  key?: string;
  value?: string;
  userId?: string;
  user?: IUser;
}

export const EUserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  HOLD: 'HOLD',
  BAN: 'BAN',
  DELETE: 'DELETE',
};

export type EUserStatus = (typeof EUserStatus)[keyof typeof EUserStatus];

export const EUserGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

export type EUserGender = (typeof EUserGender)[keyof typeof EUserGender];

export interface IUserFindOne {
  id?: string;
  email?: string;
  username?: string;
  address?: string;
}
export interface IUserFindMany extends IFindMany {
  status?: EUserStatus[];
  genders?: EUserGender[];
  deleted?: number;
  orderBy?: IOrderBy;
}

export interface IUserCreate {
  email: string;
  fullname: string;
  username?: string;
  gender?: EUserGender;
  status?: EUserStatus;
  avatarId?: string;
  address?: string;
  country?: string;
  region?: string;
  city?: string;
  zipCode?: string;
  socials?: string;
  about?: string;
  phone?: string;
  referrerId?: string;
  language?: ELanguage;
}

export interface IUserUpdate extends Partial<IUserCreate> {
  id: string;
}
