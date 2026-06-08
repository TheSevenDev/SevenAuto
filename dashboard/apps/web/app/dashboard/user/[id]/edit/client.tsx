'use client';

import { permissions } from '@seven-auto/libs';
import { RoleBasedGuard } from 'modules/auth/guard';
import { UserEditView } from 'modules/sections/user/view';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditClient({ id }: Props) {
  return (
    <RoleBasedGuard hasContent roles={[permissions.USER_UPDATE]}>
      <UserEditView id={id} />
    </RoleBasedGuard>
  );
}
