'use client';

import { Grid, Typography, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { EBalanceType } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';
import TransactionList from 'modules/sections/transaction/transaction-lists';
import {
  displayBalance,
  getBalanceColorBg,
  getBalanceIcon,
  getBalanceThemeColor,
} from 'modules/utils/balance';

import BalanceCard from '../balance-card';

// ----------------------------------------------------------------------

export default function BalanceDashboardView() {
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  const settings = useSettingsContext();
  const theme = useTheme();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      >
        {t('balance.label')}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BalanceCard
            title={t(`balance.types.${EBalanceType.CREDIT}`)}
            total={displayBalance(
              currentUser?.credits || 0,
              EBalanceType.CREDIT,
            )}
            icon={getBalanceIcon(EBalanceType.CREDIT)}
            sx={{
              backgroundColor: getBalanceColorBg(EBalanceType.CREDIT),
              boxShadow: `0 0 0 2px ${
                theme.palette[getBalanceThemeColor(EBalanceType.CREDIT)].main
              }`,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BalanceCard
            title={t(`balance.types.${EBalanceType.COMMISSION}`)}
            total={displayBalance(
              currentUser?.commissions || 0,
              EBalanceType.COMMISSION,
            )}
            icon={getBalanceIcon(EBalanceType.COMMISSION)}
            sx={{
              backgroundColor: getBalanceColorBg(EBalanceType.COMMISSION),
              boxShadow: `0 0 0 2px ${
                theme.palette[getBalanceThemeColor(EBalanceType.COMMISSION)]
                  .main
              }`,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TransactionList
            userId={currentUser?.id || ''}
            title={t('balance.transactionHistories')}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
