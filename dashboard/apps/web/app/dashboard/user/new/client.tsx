'use client';

import { permissions } from '@seven-auto/libs';
import { RoleBasedGuard } from 'modules/auth/guard';
import { UserCreateView } from 'modules/sections/user/view';

// ----------------------------------------------------------------------

export default function UserCreateClient() {
  return (
    <RoleBasedGuard hasContent roles={[permissions.USER_CREATE]}>
      <UserCreateView />
    </RoleBasedGuard>
  );
}
