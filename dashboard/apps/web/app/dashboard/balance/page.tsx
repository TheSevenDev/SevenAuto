import { ELanguage } from '@seven-auto/libs';
import { BalanceDashboardView } from 'modules/sections/balance/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export default async function BalancePage() {
  return <BalanceDashboardView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Balance',
    },
    [ELanguage.VI]: {
      title: 'Bảng điều khiển: Số dư',
    },
  };
  return metadata[locale as ELanguage];
}
