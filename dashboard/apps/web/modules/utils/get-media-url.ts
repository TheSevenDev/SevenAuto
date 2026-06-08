import { EMediaSource, IMedia } from '@seven-auto/libs';
import { ASSETS_URL } from 'modules/config-global';

export const getMediaUrl = (
  media?: IMedia,
  size?: 'tiny' | 'sm' | 'md' | 'lg' | 'original' | 'url',
): string => {
  if (!size) size = 'url';
  if (!media) return '';
  let src = '';
  if (media) {
    switch (size) {
      case 'tiny':
        if (media.urlTiny) src = media.urlTiny;
        else if (media.urlSmall) src = media.urlSmall;
        else if (media.urlMedium) src = media.urlMedium;
        else if (media.urlLarge) src = media.urlLarge;
        else src = media.url || '';
        break;
      case 'sm':
        if (media.urlSmall) src = media.urlSmall;
        else if (media.urlMedium) src = media.urlMedium;
        else if (media.urlLarge) src = media.urlLarge;
        else src = media.url || '';
        break;
      case 'md':
        if (media.urlMedium) src = media.urlMedium;
        else if (media.urlLarge) src = media.urlLarge;
        else src = media.url || '';
        break;
      case 'lg':
        src = media.urlLarge ? media.urlLarge : media.url || '';
        break;
      case 'original':
        src = media.urlRaw ? media.urlRaw : media.url || '';
        break;
      case 'url':
        src = media.url ? media.url : '';
        break;
      default:
        src = media.url ? media.url : '';
    }
  }

  if (media.source === EMediaSource.REMOTE) {
    return src;
  }

  if (src && !src.startsWith('http')) {
    src = `${ASSETS_URL}/${encodeURIComponent(src)}`;
  }
  if (!src || src === `${ASSETS_URL}/`) src = '';
  return src;
};

export const getMediaUrlWithoutAssets = (
  media?: IMedia,
  size?: 'tiny' | 'sm' | 'md' | 'lg' | 'original' | 'url',
): string => {
  const url = getMediaUrl(media, size);
  if (!url) return '';
  if (!ASSETS_URL) return url;
  return url.replace(ASSETS_URL, '__ASSETS_URL__');
};

export const addAssetsUrl = (url: string): string =>
  url.replace('__ASSETS_URL__', ASSETS_URL || '');
