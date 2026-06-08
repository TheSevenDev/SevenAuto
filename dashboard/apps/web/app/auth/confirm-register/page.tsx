import { ELanguage } from '@seven-auto/libs';
import { ConfirmRegisterView } from 'modules/sections/auth';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function ConfirmRegisterPage() {
  return <ConfirmRegisterView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Confirm Register - SevenAuto',
      description: 'Confirm Register',
    },
    [ELanguage.VI]: {
      title: 'Xác nhận đăng ký - SevenAuto',
      description: 'Xác nhận đăng ký',
    },
  };
  return metadata[locale as ELanguage];
}
