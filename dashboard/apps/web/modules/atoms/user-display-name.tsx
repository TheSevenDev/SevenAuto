import {
  Box,
  SxProps,
  Tooltip,
  Typography,
  TypographyVariant,
} from '@mui/material';
import { getDisplayName, IUser } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import React from 'react';

interface IProps {
  user: IUser | null | undefined;
  sx?: SxProps;
  variant?: TypographyVariant;
  sxTypography?: SxProps;
  sxIcon?: SxProps;
}

export default function UserDisplayName({
  user,
  variant = 'subtitle2',
  sx,
  sxTypography,
  sxIcon,
}: IProps) {
  const { t } = useTranslate();

  if (!user) return null;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 0.5,
        ...sx,
      }}
    >
      <Typography
        component="span"
        variant={variant}
        noWrap
        sx={{ ...sxTypography }}
      >
        {getDisplayName(user)}
      </Typography>
      {user?.isVerified && (
        <Tooltip placement="top" title={t('basic.verified')}>
          <Iconify
            icon={ICONS_NAME.verified}
            width={16}
            sx={{ color: 'success.main', ...sxIcon }}
          />
        </Tooltip>
      )}
    </Box>
  );
}
