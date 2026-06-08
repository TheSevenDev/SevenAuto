import { ELanguage } from '@seven-auto/libs';
import { EmailTemplateListView } from 'modules/sections/email/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function EmailTemplateListPage() {
  return <EmailTemplateListView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Email Templates',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Mẫu email',
    },
  };
  return metadata[locale as ELanguage];
}
