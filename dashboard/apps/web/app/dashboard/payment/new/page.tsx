import { ELanguage } from '@seven-auto/libs';
import { DashboardPaymentNewView } from 'modules/sections/dashboard-payment/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PaymentNewPage() {
  return <DashboardPaymentNewView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: New Payment',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Thanh toán mới',
    },
  };
  return metadata[locale as ELanguage];
}
