import { ELanguage } from '@seven-auto/libs';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function ContactPage() {
  return <div>ContactPage</div>;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Contact us - Seven Auto',
      description: 'Contact us',
    },
    [ELanguage.VI]: {
      title: 'Liên hệ - Seven Auto',
      description: 'Liên hệ',
    },
  };
  return metadata[locale as ELanguage];
}
