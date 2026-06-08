import { IPost } from '@seven-auto/libs';
import { Metadata } from 'next';

import { getMediaUrl } from './get-media-url';
import { getSocialSize } from './social-image';

export const getMetadataPost = (post: IPost): Metadata => {
  let metadata: Metadata = {
    title: 'Post Details',
    description: '',
  };
  let imageUrl = '';
  const imageSize = getSocialSize('facebook');

  let width = imageSize.width;
  let height = imageSize.height;
  if (post?.seoMeta?.media?.id) {
    imageUrl = getMediaUrl(post.seoMeta.media, 'url');
    if (post.seoMeta.media.width) {
      width = post.seoMeta.media.width;
    }
    if (post.seoMeta.media.height) {
      height = post.seoMeta.media.height;
    }
  }

  if (!imageUrl && post?.media?.id) {
    imageUrl = getMediaUrl(post.media, 'url');
    if (post.media.width) {
      width = post.media.width;
    }
    if (post.media.height) {
      height = post.media.height;
    }
  }

  if (post) {
    metadata = {
      title: post.seoMeta?.title || post.title,
      description: post.seoMeta?.description || post.description,
      keywords: post.seoMeta?.keywords,
      openGraph: {
        title: post.seoMeta?.title || post.title,
        description: post.seoMeta?.description || post.description,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width,
            height,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoMeta?.title || post.title,
        description: post.seoMeta?.description || post.description,
        images: [
          {
            url: imageUrl,
            width,
            height,
            alt: post.title,
          },
        ],
      },
    };
  }

  return metadata;
};
