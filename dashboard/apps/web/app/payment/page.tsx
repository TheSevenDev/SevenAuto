import { ELanguage } from '@seven-auto/libs';
import { PaymentView } from 'modules/sections/payment/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PaymentPage() {
  return <PaymentView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Payment - Seven Auto',
      description:
        'Secure payment processing for your Seven Auto subscription. Multiple payment methods accepted.',
    },
    [ELanguage.VI]: {
      title: 'Thanh toán - Seven Auto',
      description:
        'Xử lý thanh toán an toàn cho gói đăng ký Seven Auto của bạn. Chấp nhận nhiều phương thức thanh toán.',
    },
  };
  return metadata[locale as ELanguage];
}
