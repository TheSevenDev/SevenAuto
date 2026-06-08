import { ELanguage } from '@seven-auto/libs';
import { DashboardPaymentTransactionView } from 'modules/sections/dashboard-payment/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function DashboardTransactionPage() {
  return <DashboardPaymentTransactionView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Transaction',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Giao dịch',
    },
  };
  return metadata[locale as ELanguage];
}
