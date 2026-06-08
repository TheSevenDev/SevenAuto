/** Normalized link row for display (API may send JSON string, array, or `{ links }`). */
export type UserSocialLinkRow = {
  url: string;
  icon: string;
  color: string;
};

export function parseUserSocialLinks(socials: unknown): UserSocialLinkRow[] {
  if (socials == null || socials === '') return [];
  if (typeof socials === 'string') {
    try {
      return parseUserSocialLinks(JSON.parse(socials) as unknown);
    } catch {
      return [];
    }
  }
  if (Array.isArray(socials)) {
    return socials as UserSocialLinkRow[];
  }
  if (typeof socials === 'object' && socials !== null && 'links' in socials) {
    const { links } = socials as { links?: unknown };
    return Array.isArray(links) ? (links as UserSocialLinkRow[]) : [];
  }
  return [];
}

export const getSocialUserNameFromUrl = (url: string): string => {
  const urlObj = new URL(url);

  const pathSegments = urlObj.pathname.split('/').filter(Boolean);

  switch (urlObj.hostname) {
    case 'www.facebook.com':
    case 'facebook.com':
      if (pathSegments[0] === 'profile.php') {
        return new URLSearchParams(urlObj.search).get('id') || '';
      }
      return pathSegments[0] || '';

    case 'www.youtube.com':
    case 'youtube.com':
      if (
        pathSegments[0] === 'user' ||
        pathSegments[0] === 'channel' ||
        pathSegments[0] === 'c'
      ) {
        return pathSegments[1] || '';
      }
      return (pathSegments[0] && pathSegments[0].replace('@', '')) || '';

    case 'www.twitter.com':
    case 'twitter.com':
    case 'x.com':
    case 'www.x.com':
      return pathSegments[0] || '';

    case 'www.instagram.com':
    case 'instagram.com':
      return pathSegments[0] || '';

    case 'www.linkedin.com':
    case 'linkedin.com':
      if (pathSegments[0] === 'in' || pathSegments[0] === 'company') {
        return pathSegments[1] || '';
      }
      return '';

    case 'www.pinterest.com':
    case 'pinterest.com':
      return pathSegments[0] || '';

    case 'www.github.com':
    case 'github.com':
      return pathSegments[0] || '';

    default:
      return '';
  }
};
