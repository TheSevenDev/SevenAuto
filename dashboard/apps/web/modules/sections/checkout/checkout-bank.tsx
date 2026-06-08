'use client';

import { Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IPayment, paymentBankList, paymentCodePrefix } from '@seven-auto/libs';
import CopyIcon from 'modules/atoms/copy-icon';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import { useTranslate } from 'modules/locales';
import { fCurrency } from 'modules/utils/format-number';
import { useState } from 'react';

// ----------------------------------------------------------------------
type BankItem = (typeof paymentBankList)[0];

export default function CheckoutBank({ payment }: { payment: IPayment }) {
  const { t } = useTranslate();
  const [bank, setBank] = useState<BankItem>(paymentBankList[0] as BankItem);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('checkouts.bankGuide')}</Typography>

      <Grid container spacing={1}>
        {paymentBankList
          .filter((option) => option.code)
          .map((option) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={option.code}>
              <OptionItem
                key={option.code}
                option={option}
                selected={bank.code === option.code}
                onClick={() => setBank(option)}
              />
            </Grid>
          ))}
      </Grid>
      <Stack
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }}
        spacing={1}
      >
        <Box
          sx={{
            gap: 5,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('checkouts.amountPay')}
            </Typography>
            <Typography
              sx={{
                color: 'primary.main',
              }}
              variant="h4"
            >
              {fCurrency(payment.price || 0)}đ{' '}
              <CopyIcon text={payment.price?.toString() || ''} />
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('checkouts.transactionCode')}
            </Typography>
            <Typography
              sx={{
                color: 'secondary.main',
              }}
              variant="h4"
            >
              {paymentCodePrefix}
              {payment.uniqueId?.toUpperCase()}
              <CopyIcon
                text={`${paymentCodePrefix}${payment.uniqueId?.toUpperCase()}`}
              />
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack spacing={1}>
          <Typography variant="h6">
            {t('checkouts.bankAccountNumber')}
          </Typography>
          <Typography variant="body1">
            {bank.accountNumber}
            <CopyIcon text={bank.accountNumber} size="small" sx={{ ml: 1 }} />
          </Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack spacing={1}>
          <Typography variant="h6">{t('checkouts.bankAccountName')}</Typography>
          <Typography variant="body1">
            {bank.accountName}
            <CopyIcon text={bank.accountName} size="small" sx={{ ml: 1 }} />
          </Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack spacing={1}>
          <Typography variant="h6">
            {t('checkouts.bankAccountBranch')}
          </Typography>
          <Typography variant="body1">
            {bank.accountBranch}
            <CopyIcon text={bank.accountBranch} size="small" sx={{ ml: 1 }} />
          </Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack
          spacing={1}
          sx={{
            mt: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={`https://img.vietqr.io/image/${bank.code}-${bank.accountNumber}-compact2.jpg?amount=${payment.price}&addInfo=${paymentCodePrefix}${payment.uniqueId?.toUpperCase()}&accountName=${bank.accountName}`}
            alt="bank-qr-code"
            sx={{
              borderRadius: 1,
              width: '360px',
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  option: BankItem;
  selected: boolean;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { code, icon } = option;

  return (
    <Paper
      variant="outlined"
      key={code}
      sx={{
        width: 1,
        p: 1.5,
        cursor: 'pointer',
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
        bgcolor: (theme) =>
          selected ? theme.palette.action.selected : 'background.neutral',
      }}
      {...other}
    >
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

        <Box
          component="img"
          src={`/assets/icons/banks/${icon}.svg`}
          sx={{ width: 'auto', height: 16 }}
        />
      </Stack>
    </Paper>
  );
}
