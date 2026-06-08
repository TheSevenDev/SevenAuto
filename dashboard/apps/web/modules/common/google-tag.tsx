import { GoogleTagManager as GTM } from '@next/third-parties/google';
import { APP_ENV } from 'modules/config-global';

export default function GoogleTagManager({ gtmId }: { gtmId: string }) {
  if (!gtmId || APP_ENV !== 'production') return null;
  return <GTM gtmId={gtmId} />;
}
