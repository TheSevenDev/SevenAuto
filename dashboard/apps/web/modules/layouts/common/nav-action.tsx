import { Breakpoint, IconButton, Stack } from '@mui/material';
import { useAuthContext } from 'modules/auth/hooks';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useResponsive } from 'modules/hooks/use-responsive';
import React from 'react';

import AccountPopover from './account-popover';
import CreditsPopover from './credits-popover';
import LanguagePopover from './language-popover';
import LoginButton from './login-button';
import NotificationsPopover from './notifications-popover';
import ThemeButton from './theme-button';

interface NavActionProps {
  breakpoint?: Breakpoint;
}

export function NavAction({ breakpoint = 'lg' }: NavActionProps) {
  const { authenticated, loading } = useAuthContext();
  const lgUp = useResponsive('up', breakpoint);
  const popover = usePopover();

  const renderActionList = () => (
    <IconButton onClick={popover.onOpen}>
      <Iconify icon={ICONS_NAME.actionList} width={24} />
    </IconButton>
  );

  return (
    <>
      {!loading && (
        <>
          {authenticated ? (
            <>
              {lgUp ? (
                <>
                  <CreditsPopover />
                  <LanguagePopover />
                  <ThemeButton />
                </>
              ) : (
                renderActionList()
              )}
              <NotificationsPopover />
              <AccountPopover />
            </>
          ) : (
            <>
              {lgUp ? (
                <>
                  <CreditsPopover />
                  <LanguagePopover />
                  <ThemeButton />
                </>
              ) : (
                renderActionList()
              )}
              <LoginButton />
            </>
          )}
        </>
      )}
      <CustomPopover
        sx={{ mt: 1 }}
        open={popover.open}
        onClose={popover.onClose}
      >
        <Stack direction="row" spacing={2} sx={{ p: 1, flexWrap: 'wrap' }}>
          <CreditsPopover />
          <LanguagePopover />
          <ThemeButton />
        </Stack>
      </CustomPopover>
    </>
  );
}
