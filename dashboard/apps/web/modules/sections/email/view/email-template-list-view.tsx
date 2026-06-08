'use client';

import { Card, Container } from '@mui/material';
import { hasPermission, permissions } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import NoPermission from 'modules/components/no-permission';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';

import EmailTemplateTable from '../email-template-table';

export default function EmailTemplateListView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  const isAdmin = hasPermission(currentUser, [
    permissions.EMAIL_TEMPLATE_MANAGE,
  ]);
  if (!isAdmin) return <NoPermission />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('emails.template')}
        links={[]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <EmailTemplateTable />
      </Card>
    </Container>
  );
}
