import { ELanguage } from '@seven-auto/libs';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import UserEditClient from './client';
// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserEditPage({ params }: PageProps) {
  const { id } = await params;

  return <UserEditClient id={id} />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: User Edit',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Chỉnh sửa người dùng',
    },
  };
  return metadata[locale as ELanguage];
}
