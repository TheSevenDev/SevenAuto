'use client';

import { Box } from '@mui/material';
import NotificationBrowserRequest from 'modules/molecules/notification-browser-request';
import React from 'react';

import { APP_ENV } from '../config-global';
import { useTranslate } from '../locales';

export function GlobalComponent() {
  const { t } = useTranslate();
  const isProduction = APP_ENV === 'production';

  return (
    <>
      <NotificationBrowserRequest />
      {!isProduction && (
        <Box
          component="div"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            backgroundColor: 'error.main',
            color: 'white',
            padding: 0.1,
            zIndex: 99999,
            fontSize: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t('basic.developmentEnvironment')}
        </Box>
      )}
    </>
  );
}
