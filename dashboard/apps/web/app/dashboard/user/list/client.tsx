'use client';

import { permissions } from '@seven-auto/libs';
import { RoleBasedGuard } from 'modules/auth/guard';
import { UserListView } from 'modules/sections/user/view';

// ----------------------------------------------------------------------

export default function UserListClient() {
  return (
    <RoleBasedGuard hasContent roles={[permissions.USER_MANAGE]}>
      <UserListView />
    </RoleBasedGuard>
  );
}
