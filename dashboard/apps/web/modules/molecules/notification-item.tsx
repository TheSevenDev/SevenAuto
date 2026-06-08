import { SxProps } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { getDisplayName, INotification } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import { notificationConverter } from 'modules/context/notification/notification-converter';
import { useNotificationContext } from 'modules/context/notification/use-notification-context';
import { useTranslate } from 'modules/locales';
import { fToNow } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: INotification;
  sx?: SxProps;
};

export default function NotificationItem({
  notification,
  sx,
}: NotificationItemProps) {
  const { markAsRead } = useNotificationContext();
  const { t } = useTranslate();
  const router = useRouter();

  const notificationData = notificationConverter(notification, t, router);

  const renderAvatar = (
    <ListItemAvatar>
      {notificationData.user ? (
        <Avatar
          src={getMediaUrl(notificationData?.user?.avatar)}
          sx={{ bgcolor: 'background.neutral' }}
        >
          {getDisplayName(notificationData.user).slice(0, 1)}
        </Avatar>
      ) : (
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          <Iconify
            icon={notificationData.icon || 'noto:bell'}
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notificationData.title || '')}
      secondary={
        <Stack
          sx={{
            typography: 'caption',
            color: 'text.disabled',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notificationData.createdAt)}
          {notificationData.category}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.read && (
    <Box
      sx={{
        top: 26,
        width: 12,
        height: 12,
        right: 10,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      onClick={() => {
        if (!notification.read && notification.id) {
          if (markAsRead) markAsRead(notification.id);
        }
      }}
      sx={{
        p: 1.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        ...sx,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notificationData.content && (
          <Stack sx={{ alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 1,
                py: 0.5,
                px: 1,
                my: 0.5,
                borderRadius: 1,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
              }}
            >
              {reader(notificationData.content)}
            </Box>
          </Stack>
        )}
        {notificationData.tags && notificationData.tags.length > 0 && (
          <Stack spacing={0.75} sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {notificationData.tags.map((tag) => (
              <Label key={tag.label} variant="outlined" color={tag.color}>
                {tag.label}
              </Label>
            ))}
          </Stack>
        )}
        {notificationData.actions && notificationData.actions.length > 0 && (
          <Stack spacing={1} direction="row" sx={{ mt: 0.5 }}>
            {notificationData.actions.map((action) => (
              <Button
                key={action.label}
                size="small"
                color={action.color || 'inherit'}
                variant={action.variant || 'contained'}
                onClick={action.fn}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        fontSize: '0.875rem',
        mb: 0.5,
        '& p': {
          m: 0,
        },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
