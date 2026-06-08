'use client';

import { GuestGuard } from 'modules/auth/guard';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import AuthClassicLayout from 'modules/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { siteInfo } = useGlobalContext();
  return (
    <GuestGuard>
      <AuthClassicLayout title={siteInfo.siteName}>
        {children}
      </AuthClassicLayout>
    </GuestGuard>
  );
}
