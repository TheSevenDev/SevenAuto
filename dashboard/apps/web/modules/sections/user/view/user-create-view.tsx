'use client';

import Container from '@mui/material/Container';
import { IUser, paths } from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';
import { useRouter } from 'next/navigation';

import UserEditForm from '../user-edit-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const router = useRouter();

  const createSuccess = (user: IUser) => {
    router.push(paths.dashboard.user.edit(user.id));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users.newUser')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: t('users.newUser') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserEditForm isAdminEdit onCallback={createSuccess} />
    </Container>
  );
}
