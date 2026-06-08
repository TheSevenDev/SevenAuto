import { ASSETS_URL } from 'modules/config-global';

export const replaceAllAssetUrls = (content: string) => {
  // convert all asset urls to __ASSETS_URL__ to avoid breaking the content
  if (!content || !ASSETS_URL) return content || '';
  return content.replace(new RegExp(ASSETS_URL, 'g'), '__ASSETS_URL__');
};

export const replaceAllAssetUrlsBack = (content: string) => {
  // convert all __ASSETS_URL__ back to original asset urls
  if (!content || !ASSETS_URL) return content || '';
  return content.replace(/__ASSETS_URL__/g, ASSETS_URL);
};
