import { Avatar, Card, ListItemText } from '@mui/material';
import { getDisplayName, getFullAddress, IUser, paths } from '@seven-auto/libs';
import UserDisplayName from 'modules/atoms/user-display-name';
import Iconify from 'modules/components/iconify';
import { getMediaUrl } from 'modules/utils/get-media-url';
import Link from 'next/link';
import React from 'react';

type IProps = {
  user: IUser;
};

export default function ProfileUserItem({ user }: IProps) {
  const { avatar } = user;
  return (
    <Card
      component={Link}
      href={paths.userDetail(user.id)}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        p: (theme) => theme.spacing(2, 2, 2, 2),
      }}
    >
      <Avatar
        alt={getDisplayName(user)}
        src={getMediaUrl(avatar, 'sm')}
        sx={{ width: 48, height: 48, mr: 2 }}
      />

      <ListItemText
        primary={<UserDisplayName user={user} />}
        secondary={
          <>
            <Iconify
              icon="mingcute:location-fill"
              width={16}
              sx={{ flexShrink: 0, mr: 0.5 }}
            />
            {getFullAddress(user)}
          </>
        }
        slotProps={{
          primary: {
            noWrap: true,
            variant: 'subtitle2',
          },
          secondary: {
            // noWrap: true,
            component: 'span',
            color: 'text.disabled',
            variant: 'caption',
            sx: {
              alignItems: 'start',
              display: 'flex',
              mt: 0.5,
            },
          },
        }}
      />
      {/* TODO: Add chat button */}
      {/* TODO: Add follow button */}
    </Card>
  );
}
