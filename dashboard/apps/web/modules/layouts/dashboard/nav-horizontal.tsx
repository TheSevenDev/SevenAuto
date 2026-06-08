import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { NavSectionHorizontal } from 'modules/components/nav-section';
import Scrollbar from 'modules/components/scrollbar';
import { bgBlur } from 'modules/theme/css';
import { memo } from 'react';

import HeaderShadow from '../common/header-shadow';
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const navData = useNavData();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
