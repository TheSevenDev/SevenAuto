'use client';

import Container from '@mui/material/Container';
import { paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';

import DashboardPaymentTable from '../../dashboard-payment/dashboard-payment-table';

// ----------------------------------------------------------------------

export default function UserOrderView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users.orders')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: t('users.orders') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <DashboardPaymentTable userId={currentUser?.id || ''} />
    </Container>
  );
}
