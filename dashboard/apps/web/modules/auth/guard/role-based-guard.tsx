import { SxProps, Theme } from '@mui/material/styles';
import { hasPermission } from '@seven-auto/libs';
import NoPermission from 'modules/components/no-permission';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RoleBasedGuard({
  hasContent,
  roles,
  children,
}: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { currentUser } = useAuthContext();

  if (typeof roles !== 'undefined' && !hasPermission(currentUser, roles)) {
    return hasContent ? <NoPermission /> : null;
  }

  return <>{children}</>;
}
