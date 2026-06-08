import { MAIN_URL } from '../config-global';

interface ISocialImage {
  default: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  pinterest: string;
  instagram: string;
}

export enum ESocialPlatform {
  DEFAULT = 'default',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  PINTEREST = 'pinterest',
  INSTAGRAM = 'instagram',
}

export const socialImageSize = {
  default: {
    width: 712,
    height: 712,
  },
  facebook: {
    width: 1200,
    height: 630,
  },
  twitter: {
    width: 1200,
    height: 675,
  },
  linkedin: {
    width: 1200,
    height: 627,
  },
  pinterest: {
    width: 1000,
    height: 1500,
  },
  instagram: {
    width: 1080,
    height: 1080,
  },
};

export const getSocialSize = (platform: string) => {
  if (!socialImageSize[platform as keyof typeof socialImageSize]) {
    return socialImageSize.default;
  }
  return socialImageSize[platform as keyof typeof socialImageSize];
};

export enum ESocialType {
  FEED = 'feed',
  POST = 'post',
  KNOWLEDGE = 'knowledge',
  CHALLENGE = 'challenge',
}

export function getSocialImages({
  type,
  id,
}: {
  type: ESocialType;
  id: string;
}): ISocialImage {
  const images: ISocialImage = {
    default: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=default`,
    facebook: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=facebook`,
    twitter: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=twitter`,
    linkedin: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=linkedin`,
    pinterest: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=pinterest`,
    instagram: `${MAIN_URL}/images/featured.png?type=${type}&id=${id}&platform=instagram`,
  };

  return images;
}
