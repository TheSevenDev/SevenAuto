import { IMedia } from './media';
import { IPost } from './post';
import { IBaseEntity } from './utils';

export interface ISeoMeta extends IBaseEntity {
  title?: string;
  description?: string;
  keywords?: string;
  mediaId?: string;
  media?: IMedia;
  postId?: string;
  post?: IPost;
}
