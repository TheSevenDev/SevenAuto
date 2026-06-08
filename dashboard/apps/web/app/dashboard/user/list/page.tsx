// ----------------------------------------------------------------------

import { ELanguage } from '@seven-auto/libs';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import UserListClient from './client';

export default function UserListPage() {
  return <UserListClient />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: User List',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Danh sách người dùng',
    },
  };
  return metadata[locale as ELanguage];
}
