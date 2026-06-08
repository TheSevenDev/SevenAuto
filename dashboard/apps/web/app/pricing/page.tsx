import { ELanguage } from '@seven-auto/libs';
import PricingView from 'modules/sections/pricing/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PricingPage() {
  return <PricingView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Pricing - Seven Auto',
      description:
        'Choose the perfect plan for your journey. Flexible pricing options for individuals and teams.',
    },
    [ELanguage.VI]: {
      title: 'Bảng giá - Seven Auto',
      description:
        'Chọn gói phù hợp cho hành trình của bạn. Các tùy chọn giá linh hoạt cho cá nhân và nhóm.',
    },
  };
  return metadata[locale as ELanguage];
}
