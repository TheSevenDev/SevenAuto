import { EPostStatus } from '@prisma/client';
import { getFirstImageInContent, type IPost } from '@seven-auto/libs';
export const postCheckIsEnable = (post: IPost): IPost | null => {
  if (post.status !== EPostStatus.PUBLISHED) return null;
  if (post.publishDate && post.publishDate > new Date()) return null;
  if (post.deleted) return null;
  return post;
};

export const postCheckReturnContent = (post: IPost): IPost | null => {
  if (!post) return null;
  if (!post.media) {
    post.media = {
      id: post.media?.id,
      url: getFirstImageInContent(post.content),
      createdAt: post.media?.createdAt,
      updatedAt: post.media?.updatedAt,
    };
  }
  // user create post return content
  // user is admin return content
  // user level > 1 return content

  return post;
};
