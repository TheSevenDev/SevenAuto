'use client';

import { Container } from '@mui/material';
import { hasPermission, paths, permissions } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import NoPermission from 'modules/components/no-permission';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';

import DashboardPaymentTable from '../dashboard-payment-table';

// ----------------------------------------------------------------------

export default function DashboardPaymentView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_MANAGE]);

  if (!isAdmin) return <NoPermission />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('payments.label')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          {
            name: t('payments.label'),
            href: paths.dashboard.payment.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DashboardPaymentTable />
    </Container>
  );
}
