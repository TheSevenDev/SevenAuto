'use client';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paymentPackages } from '@seven-auto/libs';
import CreditIcon from 'modules/atoms/credit-icon';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';
import { fCurrency, fNumber } from 'modules/utils/format-number';

// ----------------------------------------------------------------------

export default function PaymentPackages({
  value = '',
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslate();
  return (
    <Stack spacing={5}>
      <Typography variant="h6">{t('payments.package')}</Typography>

      <Stack spacing={3}>
        {paymentPackages.map((option) => (
          <OptionItem
            key={option.key}
            option={option}
            selected={value === option.key}
            onClick={() => onChange(option.key)}
          />
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------
type PackagesItem = (typeof paymentPackages)[0];

type OptionItemProps = PaperProps & {
  option: PackagesItem;
  selected: boolean;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { key, credits, price, bonus } = option;
  return (
    <Paper
      variant="outlined"
      key={key}
      sx={{
        position: 'relative',
        p: 2.5,
        cursor: 'pointer',
        overflow: 'visible',
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
      {...other}
    >
      <ListItemText
        primary={
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Iconify
              icon={
                selected
                  ? 'eva:checkmark-circle-2-fill'
                  : 'eva:radio-button-off-fill'
              }
              width={24}
              sx={{
                mr: 2,
                color: selected ? 'primary.main' : 'text.secondary',
              }}
            />

            <Box component="span" sx={{ flexGrow: 1 }}>
              {fCurrency(price)}đ
            </Box>

            <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',

                  color: 'text.secondary',
                }}
              >
                +{fNumber(credits)}
                <CreditIcon sx={{ ml: 0.5 }} />
              </Typography>
            </Stack>
          </Stack>
        }
      />
      {bonus > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            borderRadius: 1,
            transform: 'translate(0%, -50%)',
          }}
        >
          <Typography variant="caption">+{fCurrency(bonus)}%</Typography>
        </Box>
      )}
    </Paper>
  );
}
