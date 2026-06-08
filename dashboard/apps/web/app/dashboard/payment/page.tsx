import { ELanguage } from '@seven-auto/libs';
import { DashboardPaymentView } from 'modules/sections/dashboard-payment/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function DashboardPaymentPage() {
  return <DashboardPaymentView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Payment',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Thanh toán',
    },
  };
  return metadata[locale as ELanguage];
}
