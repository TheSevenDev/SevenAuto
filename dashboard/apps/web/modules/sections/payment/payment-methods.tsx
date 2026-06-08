'use client';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EPaymentType, paymentMethodList } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

export default function PaymentMethods({
  method,
  setMethod,
}: {
  method: EPaymentType;
  setMethod: (newValue: EPaymentType) => void;
}) {
  const { t } = useTranslate();

  return (
    <Stack spacing={5}>
      <Typography variant="h6">{t('payments.method')}</Typography>
      <Stack spacing={3}>
        {paymentMethodList
          .filter((option) => option.enable)
          .map((option) => (
            <OptionItem
              key={option.key}
              option={option}
              selected={method === option.key}
              onClick={() => setMethod(option.key)}
            />
          ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------
type MethodItem = (typeof paymentMethodList)[0];

type OptionItemProps = PaperProps & {
  option: MethodItem;
  selected: boolean;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { key, color, icon } = option;
  const { t } = useTranslate();

  return (
    <Paper
      variant="outlined"
      key={key}
      sx={{
        p: 2.5,
        cursor: 'pointer',
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
              {t(`payments.methods.${key}`)}
            </Box>
            {icon && (
              <Stack
                spacing={1}
                color={color}
                direction="row"
                sx={{ alignItems: 'center' }}
              >
                <Iconify icon={icon} width={24} />
              </Stack>
            )}
          </Stack>
        }
        slotProps={{
          primary: {
            variant: 'subtitle2',
          },
        }}
      />
    </Paper>
  );
}
