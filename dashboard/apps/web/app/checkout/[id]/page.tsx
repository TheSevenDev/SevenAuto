import { ELanguage } from '@seven-auto/libs';
import { CheckoutView } from 'modules/sections/checkout/view';
import apiServices from 'modules/services/apiService';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params;
  const payment = await apiServices.payment.getPayment(id);
  if (!payment || !payment.id) return notFound();

  return <CheckoutView payment={payment} />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Checkout - FitnessBase',
      description: 'Checkout',
    },
    [ELanguage.VI]: {
      title: 'Thanh toán - FitnessBase',
      description: 'Thanh toán',
    },
  };
  return metadata[locale as ELanguage];
}
