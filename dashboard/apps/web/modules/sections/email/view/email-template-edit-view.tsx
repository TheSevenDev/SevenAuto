'use client';

import { Container } from '@mui/material';
import {
  handleErrorResponse,
  hasPermission,
  IEmailTemplate,
  paths,
  permissions,
} from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import EmptyContent from 'modules/components/empty-content';
import { SplashScreen } from 'modules/components/loading-screen';
import NoPermission from 'modules/components/no-permission';
import { useSettingsContext } from 'modules/components/settings';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import React, { useCallback, useEffect, useState } from 'react';

import EmailTemplateEditForm from '../email-template-edit-form';

interface IProps {
  id: string;
}

const EmailTemplateEditView = ({ id }: IProps) => {
  const settings = useSettingsContext();
  const { currentUser } = useAuthContext();

  const { t } = useTranslate();
  const [emailTemplate, setEmailTemplates] = useState<IEmailTemplate | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiServices.emailTemplate.getEmailTemplate(id);
      setEmailTemplates(res);
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isAdmin = hasPermission(currentUser, [
    permissions.EMAIL_TEMPLATE_MANAGE,
  ]);
  if (!isAdmin) return <NoPermission />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('emails.template')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('emails.template'),
            href: paths.dashboard.email.root,
          },
          { name: emailTemplate?.key },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          {emailTemplate ? (
            <EmailTemplateEditForm currentData={emailTemplate || undefined} />
          ) : (
            <EmptyContent title={t('basic.emptyData')} />
          )}
        </>
      )}
    </Container>
  );
};

export default EmailTemplateEditView;
