import { ISiteInfo } from '@seven-auto/libs';

import { APP_ENV } from '../config-global';
import GoogleTagManager from './google-tag';
import MetaPixel from './meta-pixel';

function Meta({ siteInfo }: { siteInfo: ISiteInfo }) {
  if (APP_ENV !== 'production')
    return <meta name="robots" content="noindex,nofollow" />;
  return (
    <>
      <GoogleTagManager gtmId={siteInfo?.gtmId || ''} />
      <MetaPixel pixelId={siteInfo?.pixelId || ''} />
    </>
  );
}

export default Meta;
