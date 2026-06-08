import { ELanguage } from '@seven-auto/libs';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import InviteClient from './client';

// ----------------------------------------------------------------------

export default function InvitePage() {
  return <InviteClient />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Invite Friends - Seven Auto',
      description: 'Invite your friends to join Seven Auto.',
    },
    [ELanguage.VI]: {
      title: 'Mời bạn bè - Seven Auto',
      description: 'Mời bạn bè tham gia Seven Auto.',
    },
  };
  return metadata[locale as ELanguage];
}
