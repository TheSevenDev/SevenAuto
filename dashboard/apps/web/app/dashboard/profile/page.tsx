import { ELanguage } from '@seven-auto/libs';
import { UserProfileView } from 'modules/sections/profile/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return <UserProfileView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Profile',
      description: 'Manage your personal profile, settings, and preferences.',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Hồ sơ',
      description: 'Quản lý hồ sơ cá nhân, cài đặt và tùy chọn của bạn.',
    },
  };
  return metadata[locale as ELanguage];
}
