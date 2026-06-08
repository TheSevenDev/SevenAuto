'use client';

import { SplashScreen } from 'modules/components/loading-screen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InviteClient() {
  const router = useRouter();

  useEffect(() => {
    // redirect to home page
    router.push('/');
  }, [router]);

  return <SplashScreen />;
}
