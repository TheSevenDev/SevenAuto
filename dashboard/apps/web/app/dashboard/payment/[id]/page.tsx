import { ELanguage } from '@seven-auto/libs';
import { DashboardPaymentDetailsView } from 'modules/sections/dashboard-payment/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <DashboardPaymentDetailsView id={id} />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Payment Details',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Chi tiết thanh toán',
    },
  };
  return metadata[locale as ELanguage];
}
