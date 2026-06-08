'use client';

import Container from '@mui/material/Container';
import {
  getDisplayName,
  handleErrorResponse,
  IUser,
  paths,
} from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { SplashScreen } from 'modules/components/loading-screen';
import { useSettingsContext } from 'modules/components/settings';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useCallback, useEffect, useState } from 'react';

import UserEditForm from '../user-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiServices.user.getUserById(id);
      setUser(res);
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.updateFailed')), {
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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users.editUser')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: getDisplayName(user) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isLoading ? (
        <SplashScreen />
      ) : (
        <UserEditForm currentData={user || undefined} isAdminEdit />
      )}
    </Container>
  );
}
