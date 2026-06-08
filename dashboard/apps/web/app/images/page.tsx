import {
  ELanguage,
  ESocialDisplay,
  EUserLevel,
  getDisplayName,
  ISocialImageData,
  paths,
} from '@seven-auto/libs';
import { ImageView } from 'modules/sections/images/views';
import apiServices from 'modules/services/apiService';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { ESocialType, getSocialSize } from 'modules/utils/social-image';
import { truncateText } from 'modules/utils/truncate';
import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import React from 'react';

// ----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    type: ESocialType;
    id: string;
    platform: string;
    logo: ESocialDisplay;
    qrcode: ESocialDisplay;
    user: ESocialDisplay;
    watermark: 'true' | 'false';
  }>;
}

export default async function ImagesPage({ searchParams }: PageProps) {
  const headersList = await headers();
  const hostname = (await headersList).get('x-domain') || '';
  const protocol = hostname.includes('localhost') ? 'http' : 'https';
  const locale = (await getLocale()) as ELanguage;

  const siteInfo = await apiServices.general.getSiteInfo(locale);

  const { platform, type, id, logo, qrcode, user, watermark } =
    await searchParams;
  const imageSize = getSocialSize(platform);

  const data: ISocialImageData = {
    imageSize: {
      width: imageSize.width,
      height: imageSize.height,
    },
    title: '',
    content: '',
    background: siteInfo?.siteImage ? `url(${siteInfo.siteImage})` : '',
    link: `${protocol}://${hostname}`,
    user: null,
    logo: logo || ESocialDisplay.LARGE,
    qrCode: qrcode || ESocialDisplay.LARGE,
    showUser: user,
    showWatermark: watermark === 'true',
  };

  if (type === ESocialType.POST) {
    try {
      const post = await apiServices.post.getPostById(id);
      data.title = post.title;
      if (post) {
        if (post.media && post.media.url) {
          data.background = `url(${getMediaUrl(post.media)})`;
        } else {
          data.background = '';
          data.content =
            post.description || truncateText(post.content || '', 100);
        }
        if (post.author) {
          data.user = {
            avatar: getMediaUrl(post.author?.avatar),
            fullname: getDisplayName(post.author),
            level: post.author?.level as EUserLevel,
          };
        }
        data.showUser = user || ESocialDisplay.LARGE;

        data.link = `${protocol}://${hostname}${paths.post.details(post.slug || '')}`;
      }
    } catch {
      // Do nothing
    }
  }

  return <ImageView data={data} />;
}
