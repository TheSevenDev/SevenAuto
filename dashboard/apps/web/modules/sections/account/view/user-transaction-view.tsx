'use client';

import Container from '@mui/material/Container';
import { paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';
import TransactionList from 'modules/sections/transaction/transaction-lists';

// ----------------------------------------------------------------------

export default function UserTransactionView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users.transactions')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: t('users.transactions') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <TransactionList userId={currentUser?.id || ''} />
    </Container>
  );
}
