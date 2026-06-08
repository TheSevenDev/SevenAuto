import { Stack, SxProps, Typography } from '@mui/material';
import { ICreditFee } from '@seven-auto/libs';
import CreditIcon from 'modules/atoms/credit-icon';
import { fNumber } from 'modules/utils/format-number';
import React from 'react';

interface CreditFeeBadgeProps {
  creditFee: ICreditFee;
  hasBackground?: boolean;
  sx?: SxProps;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
}

export default function CreditFeeBadge({
  creditFee,
  hasBackground = true,
  sx,
  size = 'small',
}: CreditFeeBadgeProps) {
  if (!creditFee) return null;
  if (creditFee.value === null) return null;

  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32,
    xlarge: 40,
    xxlarge: 48,
  };

  const textSizeMap = {
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
    xxlarge: '32px',
  };

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...(hasBackground && {
          p: 0.5,
          px: 1,
          borderRadius: 1,
          color: 'white',
          bgcolor: 'primary.main',
        }),
        ...sx,
      }}
    >
      <CreditIcon
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
      />
      <Typography
        variant="body1"
        sx={{
          ml: 0.5,
          fontSize: textSizeMap[size],
          ...((size === 'xlarge' || size === 'xxlarge') && {
            fontWeight: 800,
          }),
        }}
      >
        {fNumber(creditFee?.value || 0) || '0'}
      </Typography>
    </Stack>
  );
}
