'use client';

import { Container } from '@mui/material';
import { paths } from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';

import TransactionList from '../../transaction/transaction-lists';

// ----------------------------------------------------------------------

export default function UserTransactionView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('payments.transactions')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          {
            name: t('payments.label'),
            href: paths.dashboard.payment.root,
          },
          {
            name: t('payments.transactions'),
            href: paths.dashboard.payment.transaction,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TransactionList />
    </Container>
  );
}
