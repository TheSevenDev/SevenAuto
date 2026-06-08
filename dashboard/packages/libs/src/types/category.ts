import { IMedia } from './media';
import { IPost } from './post';
import {
  EStatus,
  IBaseEntity,
  IFindMany,
  IFindManyResponse,
  IOrderBy,
} from './utils';

export type ICategory = IBaseEntity & {
  slug?: string;
  title?: string;
  description?: string;
  status?: EStatus;
  sort?: number;
  deleted?: boolean;
  color?: string;
  imageId?: string;
  iconId?: string;
  mediaIcon?: IMedia;
  mediaImage?: IMedia;
  posts?: IPost[];
  //
  categoryId?: string;
};

export type IFindCategoryWithPostResponse = Omit<
  IFindManyResponse<IPost>,
  'total' | 'category'
> & {
  total: number;
  category?: ICategory;
};

// Action
export type ICategoryCreate = {
  title: string;
  slug?: string;
  description?: string;
  status?: EStatus;
  sort?: number;
  color?: string;
  imageId?: string;
  iconId?: string;
};

export type ICategoryUpdate = ICategoryCreate & {
  id: string;
};

export type ICategoryFindMany = IFindMany & {
  isSort?: boolean;
  status?: EStatus;
  deleted?: boolean;
  orderBy?: IOrderBy;
};

export type ICategoryFindManyPost = IFindMany & {
  orderBy?: IOrderBy;
};
