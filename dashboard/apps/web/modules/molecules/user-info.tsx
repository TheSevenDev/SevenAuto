import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import { getDisplayName, IUser } from '@seven-auto/libs';
import UserDisplayName from 'modules/atoms/user-display-name';
import React from 'react';

interface UserInfoProps {
  data: IUser;
}

const UserInfo = ({ data }: UserInfoProps) => (
  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
    <Badge color="success" overlap="circular" badgeContent=" " variant="online">
      <Avatar
        sx={{
          border: 2,
          borderColor: (theme) => theme.palette.primary.main,
        }}
        alt={getDisplayName(data) || ''}
        src={data.avatar?.url}
      />
    </Badge>

    <Box sx={{ flexGrow: 1 }}>
      <UserDisplayName user={data} />
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
        }}
      >
        {data.about}
      </Typography>
    </Box>
  </Stack>
);

export default UserInfo;
