import { SxProps } from '@mui/material';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import React from 'react';

interface IProps {
  sx?: SxProps;
}

export default function CreditIcon({ sx, ...rest }: IProps) {
  return (
    <Iconify
      icon={ICONS_NAME.credit}
      sx={{
        ...sx,
      }}
      {...rest}
    />
  );
}
