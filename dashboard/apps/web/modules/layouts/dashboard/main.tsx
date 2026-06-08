import Box, { BoxProps } from '@mui/material/Box';
import { useSettingsContext } from 'modules/components/settings';
import { useResponsive } from 'modules/hooks/use-responsive';
import { usePathname } from 'next/navigation';

import { HEADER, NAV, SPACING } from '../config-layout';

// ----------------------------------------------------------------------

const excludePaddingPath = [''];

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const isExcludePadding = excludePaddingPath.some((path) => pathname === path);

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: `${HEADER.H_MOBILE + 24}px`,
          ...(!isExcludePadding && {
            pb: 10,
            ...(lgUp && { pb: 15 }),
          }),
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(!isExcludePadding
          ? {
              py: `${HEADER.H_MOBILE + SPACING}px`,
              ...(lgUp && {
                py: `${HEADER.H_DESKTOP + SPACING}px`,
              }),
            }
          : {
              pt: `${HEADER.H_MOBILE + SPACING}px`,
              ...(lgUp && {
                pt: `${HEADER.H_DESKTOP + SPACING}px`,
              }),
            }),
        ...(lgUp && {
          px: 0,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
