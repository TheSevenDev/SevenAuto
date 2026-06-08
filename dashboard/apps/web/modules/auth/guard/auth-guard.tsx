import { paths } from '@seven-auto/libs';
import { SplashScreen } from 'modules/components/loading-screen';
import { useRouter } from 'modules/routes/hooks';
import { useCallback, useEffect, useState } from 'react';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  api: paths.auth.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const { authenticated, method, currentUser } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();

    if (!authenticated) {
      const loginPath = loginPaths[method];
      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else if (!currentUser?.isVerified) {
      const verifyPath = paths.auth.verify;
      const href = `${verifyPath}?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router, currentUser?.isVerified]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
