import Badge, { badgeClasses } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { SxProps, Theme } from '@mui/material/styles';
import { m } from 'framer-motion';
import { varHover } from 'modules/components/animate';
import Iconify from 'modules/components/iconify';
import { useSettingsContext } from 'modules/components/settings';
import { ICONS_NAME } from 'modules/const/icons';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function ThemeButton({ sx }: Props) {
  const settings = useSettingsContext();

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <Box component={m.div} whileTap={{ scale: 0.9 }}>
        <Box
          component={m.div}
          initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <IconButton
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.05)}
            aria-label="settings"
            onClick={settings.onToggle}
            sx={{
              width: 40,
              height: 40,
            }}
          >
            <Iconify
              icon={
                settings.themeMode === 'dark'
                  ? ICONS_NAME.dark
                  : ICONS_NAME.light
              }
              width={24}
            />
          </IconButton>
        </Box>
      </Box>
    </Badge>
  );
}
