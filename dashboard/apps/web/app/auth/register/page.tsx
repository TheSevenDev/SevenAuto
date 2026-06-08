import { ELanguage } from '@seven-auto/libs';
import { RegisterForm } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return <RegisterForm />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Register - Seven Auto',
      description: 'Register',
    },
    [ELanguage.VI]: {
      title: 'Đăng ký - Seven Auto',
      description: 'Đăng ký',
    },
  };
  return metadata[locale as ELanguage];
}
