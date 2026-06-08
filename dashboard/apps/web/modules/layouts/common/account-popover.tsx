'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDisplayName, handleErrorResponse, paths } from '@seven-auto/libs';
import { m } from 'framer-motion';
import UserDisplayName from 'modules/atoms/user-display-name';
import {
  removeSessionByAdmin,
  STORAGE_KEY_ACCESS_TOKEN,
} from 'modules/auth/context/utils';
import { useAuthContext } from 'modules/auth/hooks';
import { varHover } from 'modules/components/animate';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import { getCookie } from 'modules/utils/cookie-utils';
import { getMediaUrl } from 'modules/utils/get-media-url';
import Link from 'next/link';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'nav.home',
    linkTo: '/',
  },
  {
    label: 'nav.dashboard',
    linkTo: paths.dashboard.root,
  },
  {
    label: 'profile',
    linkTo: paths.dashboard.user.profile,
  },
  {
    label: 'nav.settings',
    linkTo: paths.dashboard.user.account,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { currentUser } = useAuthContext();

  const { logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), {
        variant: 'error',
      });
    }
  };

  const hasAdminCookie = useMemo(
    () => !!getCookie(`admin_${STORAGE_KEY_ACCESS_TOKEN}`),
    [],
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={getMediaUrl(currentUser?.avatar, 'sm')}
          alt={getDisplayName(currentUser)}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {getDisplayName(currentUser)?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ p: 0, minWidth: 200, maxWidth: 250 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <UserDisplayName user={currentUser} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {currentUser?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem component={Link} href={option.linkTo} key={option.label}>
              {t(option.label)}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {hasAdminCookie && (
          <MenuItem
            sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'primary.main' }}
            onClick={() => {
              removeSessionByAdmin();
              window.location.href = paths.dashboard.root;
            }}
          >
            Switch to Admin
          </MenuItem>
        )}
        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
