'use client';

import { Card, CardContent, CardHeader, Container } from '@mui/material';
import { hasPermission, paths, permissions } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import NoPermission from 'modules/components/no-permission';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';
import DashboardToolbar from 'modules/molecules/dashboard-toolbar';
import { useRouter } from 'next/navigation';

import DashboardPaymentEditForm from '../dashboard-payment-edit-form';

// ----------------------------------------------------------------------

export default function DashboardPaymentNewView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const router = useRouter();
  const { currentUser } = useAuthContext();

  const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_CREATE]);

  if (!isAdmin) return <NoPermission />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <DashboardToolbar
        title={`${t('payments.label')}`}
        backLink={paths.dashboard.payment.root}
        description={t('payments.label')}
      />

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          sx={{
            textTransform: 'capitalize',
          }}
          title={t('payments.new')}
        />
        <CardContent>
          <DashboardPaymentEditForm
            onCallback={(data) => {
              router.push(paths.dashboard.payment.details(data.id));
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
