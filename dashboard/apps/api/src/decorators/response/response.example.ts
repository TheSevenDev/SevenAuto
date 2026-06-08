import {
  EMediaSource,
  EMediaType,
  EPostStatus,
  IMedia,
  IPost,
  IUser,
  IUserMeta,
} from '@seven-auto/libs';

export const userSimpleResponseExample: IUser = {
  id: '1',
  fullname: 'example',
  username: 'example',
  address: 'example',
  socials: '[]',
  about: 'example',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userResponseExample: IUser = {
  ...userSimpleResponseExample,
  email: 'example',
};

export const userMetaResponseExample: IUserMeta = {
  id: '1',
  key: 'example',
  value: 'example',
  userId: 'example',
  user: userSimpleResponseExample,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mediaResponseExample: IMedia = {
  id: '1',
  title: 'example',
  alt: 'example',
  ext: 'example',
  hash: 'example',
  width: 1,
  height: 1,
  size: 1,
  url: 'example',
  urlRaw: 'example',
  urlLarge: 'example',
  urlMedium: 'example',
  urlSmall: 'example',
  urlTiny: 'example',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdById: 'example',
  createdBy: userSimpleResponseExample,
  type: EMediaType.IMAGE,
  source: EMediaSource.LOCAL,
};

export const postResponseExample: IPost = {
  id: '1',
  slug: 'example',
  title: 'example',
  description: 'example',
  content: 'example',
  views: 1,
  status: EPostStatus.PUBLISHED,
  hot: true,
  deleted: false,
  canComment: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishDate: new Date(),
  authorId: '1',
  author: userSimpleResponseExample,
  mediaId: '1',
  media: mediaResponseExample,
  metas: [],
  categories: [],
  related: [],
};
