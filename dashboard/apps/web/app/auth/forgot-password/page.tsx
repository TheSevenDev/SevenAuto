import { ELanguage } from '@seven-auto/libs';
import { ForgotPasswordForm } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Forgot Password - Seven Auto',
      description: 'Forgot Password',
    },
    [ELanguage.VI]: {
      title: 'Quên mật khẩu - Seven Auto',
      description: 'Quên mật khẩu',
    },
  };
  return metadata[locale as ELanguage];
}
