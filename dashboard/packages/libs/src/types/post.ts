import { ICategory } from './category';
import { IMedia } from './media';
import { ISeoMeta } from './seo-meta';
import { IUser } from './user';
import { IBaseEntity, IFindMany, IOrderBy } from './utils';

export interface IPost extends IBaseEntity {
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  views?: number;
  status?: EPostStatus;
  source?: string;
  hot?: boolean;
  deleted?: boolean;
  publishDate?: Date;
  canComment?: boolean;
  authorId?: string;
  author?: IUser;
  mediaId?: string;
  media?: IMedia;
  metas?: IPostMeta[];
  categories?: ICategory[];
  related?: IPost[];
  postRelated?: IPost[];
  seoMeta?: Partial<ISeoMeta>;
  postRelatedId?: string;
  sort?: number;
}

export interface IPostMeta extends IBaseEntity {
  postId?: string;
  key?: string;
  value?: string;
  post?: IPost;
}

export interface IPostMetaUpdatePost {
  postId: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
}

export const EPostStatus = {
  DRAFT: 'DRAFT',
  // PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  TRASH: 'TRASH',
};
export type EPostStatus = (typeof EPostStatus)[keyof typeof EPostStatus];

// Action

export interface IPostFindMany extends IFindMany {
  status?: EPostStatus;
  deleted?: boolean;
  hot?: boolean;
  isEdited?: boolean;
  authorId?: string;
  authName?: string;
  categories?: string[];
  orderBy?: IOrderBy;
}

export interface IPostCreate {
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  status?: EPostStatus;
  source?: string;
  hot?: boolean;
  publishDate?: string;
  canComment?: boolean;
  mediaId?: string;
  categoryIds?: string[];
  relatedIds?: string[];
  seoMeta?: Partial<ISeoMeta>;
}

export interface IPostUpdate extends IPostCreate {
  id: string;
}

export interface IPostMeta extends IBaseEntity {
  key?: string;
  value?: string;
  postId?: string;
  post?: IPost;
}

export interface IPostMetaUpdatePost {
  postId: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
}

export interface IPostRevisionFindMany extends IFindMany {
  id?: string;
  orderBy?: IOrderBy;
}

export interface IPostSummary {
  total: number;
  pending: number;
  published: number;
  draft: number;
  trash: number;
  scheduled: number;
  hot: number;
}
