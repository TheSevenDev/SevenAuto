import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { INotification, paths } from '@seven-auto/libs';
import { m } from 'framer-motion';
import { varHover } from 'modules/components/animate';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import Scrollbar from 'modules/components/scrollbar';
import { ICONS_NAME } from 'modules/const/icons';
import { useNotificationContext } from 'modules/context/notification/use-notification-context';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useResponsive } from 'modules/hooks/use-responsive';
import { useTranslate } from 'modules/locales';
import NotificationItem from 'modules/molecules/notification-item';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const { t } = useTranslate();

  const smUp = useResponsive('up', 'sm');
  const {
    stats,
    query,
    setQuery,
    total,
    notifications,
    loadMore,
    markAllAsRead,
  } = useNotificationContext();

  const TABS = [
    {
      value: 'all',
      label: t('basic.all'),
      count: stats.total,
    },
    {
      value: 'unread',
      label: t('basic.unread'),
      count: stats.unread,
    },
  ];

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setQuery({ unread: newValue === 'unread', skip: 0 });
    },
    [setQuery],
  );

  const handleRequestPermission = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const notificationPermission = useMemo(() => {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  }, []);

  const renderHead = (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', py: 2, pl: 2.5, pr: 1, minHeight: 68 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('notifications.label')}
      </Typography>
      {notificationPermission !== 'granted' && (
        <Tooltip title={t('notifications.requestPermission')}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestPermission}
          >
            {t('notifications.on')}
          </Button>
        </Tooltip>
      )}

      {!!stats.unread && (
        <Tooltip title={t('notifications.markAllAsRead')}>
          <IconButton color="primary" onClick={markAllAsRead}>
            <Iconify icon={ICONS_NAME.markAllAsRead} />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const currentTab = query.unread ? 'unread' : 'all';

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Tooltip title={t('notifications.note')}>
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === currentTab) &&
                    'filled') ||
                  'soft'
                }
                color={
                  (tab.value === 'unread' && 'info') ||
                  (tab.value === 'archived' && 'success') ||
                  'default'
                }
              >
                {tab.count}
              </Label>
            </Tooltip>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification: INotification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <Box
        component={m.div}
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{
          duration: 2,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          color={drawer.value ? 'primary' : 'default'}
          onClick={drawer.onTrue}
        >
          <Badge badgeContent={stats.unread} color="error">
            <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
          </Badge>
        </IconButton>
      </Box>
      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        disableRestoreFocus
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: {
            sx: { width: 1, maxWidth: 420 },
          },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            pl: 2.5,
            pr: 1,
          }}
        >
          {renderTabs}
          <IconButton
            component={Link}
            href={`${paths.dashboard.user.account}?tab=notifications`}
          >
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        </Stack>

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button
            disabled={notifications.length >= total}
            onClick={loadMore}
            fullWidth
            size="large"
          >
            {t('basic.viewMore')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
