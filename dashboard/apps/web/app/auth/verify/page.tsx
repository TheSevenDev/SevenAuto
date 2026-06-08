import { ELanguage } from '@seven-auto/libs';
import { VerifyEmailView } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Verify Email - Seven Auto',
      description: 'Verify Email',
    },
    [ELanguage.VI]: {
      title: 'Xác thực email - Seven Auto',
      description: 'Xác thực email',
    },
  };
  return metadata[locale as ELanguage];
}
