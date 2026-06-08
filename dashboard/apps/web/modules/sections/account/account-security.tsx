import { Stack } from '@mui/material';
import { IUser } from '@seven-auto/libs';
import React from 'react';

import AccountChangePassword from './account-change-password';

interface IProps {
  user: IUser | null;
  onCallback?: () => void;
}

const AccountSecurity = ({ user, onCallback }: IProps) => (
  <Stack spacing={3}>
    <AccountChangePassword user={user} onCallback={onCallback} />
  </Stack>
);

export default AccountSecurity;
