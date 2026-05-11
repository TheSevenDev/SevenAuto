import { IBaseEntity, IFindMany } from './utils';
import { IUser } from './user';

export interface IMedia extends IBaseEntity {
  title?: string;
  alt?: string;
  ext?: string;
  hash?: string;
  width?: number;
  height?: number;
  size?: number;
  url?: string;
  urlRaw?: string;
  urlLarge?: string;
  urlMedium?: string;
  urlSmall?: string;
  urlTiny?: string;
  createdById?: string;
  createdBy?: IUser;
  type?: EMediaType;
  source?: EMediaSource;
}

export const EMediaSource = {
  LOCAL: 'LOCAL',
  REMOTE: 'REMOTE',
};

export type EMediaSource = (typeof EMediaSource)[keyof typeof EMediaSource];

export const EMediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE',
};

export type EMediaType = (typeof EMediaType)[keyof typeof EMediaType];

// Action
export interface IMediaFindOne {
  id?: string;
}

export interface IMediaFindMany extends IFindMany {
  ext?: string;
  source?: EMediaSource;
  types?: EMediaType[];
  size_gte?: number;
  size_lte?: number;
  createdById?: string;
  createdAt_gte?: Date;
  createdAt_lte?: Date;
  updatedAt_gte?: Date;
  updatedAt_lte?: Date;
  orderBy?: Record<string, 'ASC' | 'DESC'>;
}

export interface IMediaSaveRemote {
  title?: string;
  alt?: string;
  width?: number;
  height?: number;
  ext?: string;
  size?: number;
  hash?: string;
  url: string;
  raw?: string;
  medium?: string;
  small?: string;
  tiny?: string;
  large?: string;
}

export interface IMediaUpdate {
  id: string;
  file?: File;
  title?: string;
  hash?: string;
  alt?: string;
}

export interface IMediaUpload {
  file: File;
  key?: string;
  signature?: string;
}

export interface IMediaUploadFromUrl {
  url: string;
  alt?: string;
  key?: string;
  signature?: string;
}

export interface IMediaDelete {
  key: string;
  signature: string;
}
