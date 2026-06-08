import { ELanguage } from '@seven-auto/libs';
import { ResetPasswordView } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return <ResetPasswordView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Reset Password - Seven Auto',
      description: 'Reset Password',
    },
    [ELanguage.VI]: {
      title: 'Đặt lại mật khẩu - Seven Auto',
      description: 'Đặt lại mật khẩu',
    },
  };
  return metadata[locale as ELanguage];
}
