import { IMedia } from './media';
import { IRole } from './role';
import {
  ELanguage,
  IBaseEntity,
  IFindMany,
  IOrderBy,
  JsonValue,
} from './utils';

export type IUser = IBaseEntity & {
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
  socials?: JsonValue;
  about?: string;
  content?: string;
  isVerified?: boolean;
  status?: EUserStatus;
  setting?: IUserSetting;
  deleted?: boolean;
  avatarId?: string;
  avatar?: IMedia;
  coverId?: string;
  cover?: IMedia;
  roleId?: string;
  role?: IRole;
  referrerId?: string;
  referrer?: IUser;
  language?: ELanguage;
  metas?: IUserMeta[];
  level?: EUserLevel;
  lastActivity?: Date;
  credits?: number;
  commissions?: number;
};

export type IUserMeta = IBaseEntity & {
  key?: string;
  value?: JsonValue;
  userId?: string;
  user?: IUser;
};

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

export const EUserLevel = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  PREMIUM: 'PREMIUM',
};

export type EUserLevel = (typeof EUserLevel)[keyof typeof EUserLevel];

export const EActivityStatus = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  ALWAY: 'ALWAY',
  BUSY: 'BUSY',
};

export type EActivityStatus =
  (typeof EActivityStatus)[keyof typeof EActivityStatus];

export type IUserFindOne = {
  id?: string;
  email?: string;
  username?: string;
  address?: string;
};
export type IUserFindMany = IFindMany & {
  referrerId?: string;
  roleId?: string;
  levels?: EUserLevel[];
  isVerified?: boolean;
  status?: EUserStatus[];
  genders?: EUserGender[];
  deleted?: number;
  orderBy?: IOrderBy;
};

export interface IUserCreate {
  email: string;
  fullname: string;
  username?: string;
  password?: string;
  status?: EUserStatus;
  avatarId?: string;
  coverId?: string;
  sendMail?: boolean;
  roleId?: string;
  isVerified?: boolean;
  address?: string;
  country?: string;
  region?: string;
  city?: string;
  zipCode?: string;
  socials?: Record<string, unknown>;
  about?: string;
  phone?: string;
  level?: EUserLevel;
  referrerId?: string;
  credits?: number;
  commissions?: number;
  language?: ELanguage;
  gender?: EUserGender;
}

export type IUserUpdate = Partial<IUserCreate> & {
  id: string;
  setting?: IUserSetting;
};

export interface IUserSocialCard {
  avatar: string;
  fullname: string;
  level: EUserLevel;
}

export type IUserSetting = {
  notification: {
    like: boolean;
    comment: boolean;
    payment: boolean;
  };
  email: {
    like: boolean;
    comment: boolean;
    payment: boolean;
  };
};

export const DEFAULT_USER_SETTING: IUserSetting = {
  notification: {
    like: true,
    comment: true,
    payment: true,
  },
  email: {
    like: true,
    comment: true,
    payment: true,
  },
};

export interface IUserStats {
  postCount: number;
}
