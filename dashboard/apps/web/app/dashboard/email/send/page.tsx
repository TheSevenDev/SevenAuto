import { ELanguage } from '@seven-auto/libs';
import { EmailSendView } from 'modules/sections/email/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function EmailSendPage() {
  return <EmailSendView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Email Send',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Gửi email',
    },
  };
  return metadata[locale as ELanguage];
}
