import { Prisma } from '@prisma/client';
import { userSelect } from 'src/modules/user/user.select';

const PostBasicSelect: Prisma.PostSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  title: true,
  views: true,
  hot: true,
  description: true,
  authorId: true,
  mediaId: true,
  publishDate: true,
  deleted: true,
  status: true,
  media: true,
  canComment: true,
  source: true,
  author: {
    select: {
      ...userSelect.basic,
    },
  },
  seoMeta: {
    select: {
      id: true,
      title: true,
      description: true,
      keywords: true,
      mediaId: true,
      media: true,
    },
  },
};

const PostDetailSelect: Prisma.PostSelect = {
  ...PostBasicSelect,
  author: {
    select: userSelect.basic,
  },
  categories: {
    select: {
      id: true,
      categoryId: true,
      sort: true,
    },
  },
  related: {
    select: {
      id: true,
      postRelatedId: true,
      sort: true,
    },
  },
};

const PostFullSelect: Prisma.PostSelect = {
  ...PostDetailSelect,
};

const PostAdminSelect: Prisma.PostSelect = {
  ...PostDetailSelect,
};

export const postSelect: {
  basic: Prisma.PostSelect;
  detail: Prisma.PostSelect;
  full: Prisma.PostSelect;
  admin: Prisma.PostSelect;
} = {
  basic: PostBasicSelect,
  detail: PostDetailSelect,
  full: PostFullSelect,
  admin: PostAdminSelect,
};
