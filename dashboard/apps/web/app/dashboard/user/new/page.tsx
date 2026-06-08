import { ELanguage } from '@seven-auto/libs';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import UserCreateClient from './client';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return <UserCreateClient />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Create a new user',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Tạo người dùng mới',
    },
  };
  return metadata[locale as ELanguage];
}
