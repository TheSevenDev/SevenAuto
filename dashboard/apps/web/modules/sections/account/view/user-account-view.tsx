'use client';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import Iconify from 'modules/components/iconify';
import { useSettingsContext } from 'modules/components/settings';
import { ICONS_NAME } from 'modules/const/icons';
import { useTab } from 'modules/hooks/use-tab';
// ----------------------------------------------------------------------
import { useTranslate } from 'modules/locales';
import UserEditForm from 'modules/sections/user/user-edit-form';
import { parseUserSocialLinks } from 'modules/utils/socials';
import { useCallback, useMemo } from 'react';

import AccountBilling from '../account-billing';
import AccountNotifications from '../account-notifications';
import AccountSecurity from '../account-security';
import AccountSocialLinks, { IUserSocialLink } from '../account-social-links';
// ----------------------------------------------------------------------

const getSocialLinks = (socials: unknown): IUserSocialLink[] =>
  parseUserSocialLinks(socials) as IUserSocialLink[];

export default function AccountView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser, reloadCurrentUser } = useAuthContext();

  const TABS = useMemo(
    () => [
      {
        value: 'general',
        label: t('users.general'),
        isShow: true,
        icon: <Iconify icon={ICONS_NAME.general} width={24} />,
      },
      // {
      //   value: 'billing',
      //   label: t('users.billing'),
      //   isShow: true,
      //   icon: <Iconify icon={ICONS_NAME.billing} width={24} />,
      // },
      {
        value: 'social',
        label: t('users.social'),
        isShow: true,
        icon: <Iconify icon={ICONS_NAME.social} width={24} />,
      },
      {
        value: 'notifications',
        label: t('users.notifications'),
        isShow: true,
        icon: <Iconify icon={ICONS_NAME.notifications} width={24} />,
      },
      {
        value: 'security',
        label: t('users.security'),
        isShow: true,
        icon: <Iconify icon={ICONS_NAME.security} width={24} />,
      },
    ],
    [t],
  );

  const [currentTab, setCurrentTab] = useTab('tab', TABS[0]?.value || '');

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab],
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('users.account')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.profile },
          { name: t('users.account') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => {
          if (!tab.isShow) return null;
          return (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          );
        })}
      </Tabs>

      {currentTab === 'general' && (
        <UserEditForm
          currentData={currentUser || undefined}
          onCallback={reloadCurrentUser}
        />
      )}

      {currentTab === 'billing' && (
        <AccountBilling
          user={currentUser || undefined}
          onCallback={reloadCurrentUser}
        />
      )}

      {currentTab === 'notifications' && (
        <AccountNotifications
          user={currentUser}
          onCallback={reloadCurrentUser}
        />
      )}

      {currentTab === 'social' && (
        <AccountSocialLinks
          userId={currentUser?.id}
          onCallback={reloadCurrentUser}
          socialLinks={getSocialLinks(currentUser?.socials)}
        />
      )}

      {currentTab === 'security' && (
        <AccountSecurity user={currentUser} onCallback={reloadCurrentUser} />
      )}
    </Container>
  );
}
