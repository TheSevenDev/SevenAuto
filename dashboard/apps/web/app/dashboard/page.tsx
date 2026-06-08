import { ELanguage } from '@seven-auto/libs';
import { OverviewAppView } from 'modules/sections/overview/app/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return <OverviewAppView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Overview',
      description: 'Your personal Seven Auto dashboard.',
    },
    [ELanguage.VI]: {
      title: 'Overview',
      description: 'Bảng điều khiển Seven Auto cá nhân của bạn.',
    },
  };
  return metadata[locale as ELanguage];
}
