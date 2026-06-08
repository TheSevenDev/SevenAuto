import { ELanguage } from '@seven-auto/libs';
import { LoginForm } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return <LoginForm />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Login - Seven Auto',
      description: 'Login',
    },
    [ELanguage.VI]: {
      title: 'Đăng nhập - Seven Auto',
      description: 'Đăng nhập',
    },
  };
  return metadata[locale as ELanguage];
}
