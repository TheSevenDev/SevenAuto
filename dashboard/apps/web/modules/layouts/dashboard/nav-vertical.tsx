import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Logo from 'modules/components/logo';
import { NavSectionVertical } from 'modules/components/nav-section';
import Scrollbar from 'modules/components/scrollbar';
import SiteName from 'modules/components/site-name';
import { useResponsive } from 'modules/hooks/use-responsive';
import { usePathname } from 'modules/routes/hooks';
import { useEffect } from 'react';

import NavToggleButton from '../common/nav-toggle-button';
import NavUpgrade from '../common/nav-upgrade';
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
        <SiteName sx={{ mt: 3, mb: 1 }} />
      </Box>

      <NavSectionVertical data={navData} />

      <Box sx={{ flexGrow: 1 }} />

      <NavUpgrade />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          slotProps={{
            paper: {
              sx: {
                width: NAV.W_VERTICAL,
              },
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
