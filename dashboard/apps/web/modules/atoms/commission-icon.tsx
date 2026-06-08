import { SxProps } from '@mui/material';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import React from 'react';

interface IProps {
  sx?: SxProps;
}

export default function CommissionIcon({ sx, ...rest }: IProps) {
  return (
    <Iconify
      icon={ICONS_NAME.commission}
      sx={{
        ...sx,
      }}
      {...rest}
    />
  );
}
