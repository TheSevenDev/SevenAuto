import { ELanguage } from '@seven-auto/libs';
import { AccountView } from 'modules/sections/account/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return <AccountView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Account',
      description: 'Account',
    },
    [ELanguage.VI]: {
      title: 'Tài khoản',
      description: 'Tài khoản',
    },
  };
  return metadata[locale as ELanguage];
}
