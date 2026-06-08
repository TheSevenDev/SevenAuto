'use client';

import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { getDisplayName, paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import Iconify from 'modules/components/iconify';
import { useSettingsContext } from 'modules/components/settings';
import { useTab } from 'modules/hooks/use-tab';
import { useTranslate } from 'modules/locales';
import { useCallback } from 'react';

import ProfileCover from '../profile-cover';
import ProfileHome from '../profile-home';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const { t } = useTranslate();
  const { currentUser, reloadCurrentUser } = useAuthContext();

  const TABS = [
    {
      value: 'profile',
      label: t('profile'),
      isShow: true,
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
  ];

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useTab('tab', TABS[0]?.value || '');

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab],
  );

  if (!currentUser) return null;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('profile')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          { name: getDisplayName(currentUser) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <Button
            href={paths.dashboard.user.account}
            variant="contained"
            size="small"
          >
            {t('users.editProfile')}
          </Button>
        }
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          user={currentUser}
          onCallBack={() => {
            reloadCurrentUser();
          }}
        />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.list}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => {
            if (!tab.isShow) return null;
            return (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
              />
            );
          })}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileHome info={currentUser} />}
    </Container>
  );
}
