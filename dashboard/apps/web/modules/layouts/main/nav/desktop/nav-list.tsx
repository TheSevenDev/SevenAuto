import Fade from '@mui/material/Fade';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import { useTranslate } from 'modules/locales';
import { usePathname } from 'modules/routes/hooks';
import { useActiveLink } from 'modules/routes/hooks/use-active-link';
import { paper } from 'modules/theme/css';
import { useCallback, useEffect, useState } from 'react';

import { HEADER } from '../../../config-layout';
import { NavItemSubheaderProps, NavListProps, NavSubListProps } from '../types';
import { NavItem } from './nav-item';
// ----------------------------------------------------------------------

export default function NavList({ data }: NavListProps) {
  const theme = useTheme();

  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(false);
  const popover = usePopover();

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(true);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const hasChildren = data.children && data.children.length > 0;
  const isSubheader = data.type === 'subheader';

  return (
    <>
      <NavItem
        open={openMenu || Boolean(popover.open)}
        onMouseEnter={(e) => {
          if (isSubheader) {
            handleOpenMenu();
          } else {
            popover.onOpen(e);
          }
        }}
        onMouseLeave={() => {
          if (isSubheader) {
            handleCloseMenu();
          }
        }}
        //
        title={data.title}
        path={data.path}
        //
        hasChild={hasChildren}
        externalLink={data.path?.includes('http')}
        //
        active={active}
      />

      {hasChildren && openMenu && isSubheader && (
        <Portal>
          <Fade in={openMenu}>
            <Paper
              onMouseEnter={handleOpenMenu}
              onMouseLeave={handleCloseMenu}
              sx={{
                ...paper({ theme }),
                left: 0,
                right: 0,
                m: 'auto',
                display: 'flex',
                borderRadius: 2,
                position: 'fixed',
                zIndex: theme.zIndex.modal,
                p: theme.spacing(5, 1, 1, 3),
                top: HEADER.H_DESKTOP_OFFSET,
                maxWidth: theme.breakpoints.values.lg,
                boxShadow: theme.customShadows.dropdown,
              }}
            >
              {data.children?.map((list, index) => {
                if (!('subheader' in list)) return null;
                return (
                  <NavSubList
                    key={index}
                    subheader={(list as NavItemSubheaderProps).subheader}
                    data={list.items}
                  />
                );
              })}
            </Paper>
          </Fade>
        </Portal>
      )}
      {hasChildren && !isSubheader && (
        <CustomPopover
          open={popover.open}
          hiddenArrow
          onClose={popover.onClose}
        >
          <Stack spacing={2} sx={{ p: theme.spacing(2, 2, 2, 3) }}>
            {data.children?.map((list, index) => {
              if (!('title' in list)) return null;
              return (
                <NavItem
                  key={index}
                  title={list.title}
                  path={list.path}
                  subItem
                  active={
                    pathname === list.path || pathname === `${list.path}/`
                  }
                />
              );
            })}
          </Stack>
        </CustomPopover>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, subheader, sx, ...other }: NavSubListProps) {
  const pathname = usePathname();
  const { t } = useTranslate();

  return (
    <Stack
      spacing={2}
      sx={{
        pb: 2,
        flexGrow: 1,
        alignItems: 'flex-start',
        ...sx,
      }}
      {...other}
    >
      <ListSubheader
        disableSticky
        sx={{
          p: 0,
          typography: 'overline',
          fontSize: 11,
          color: 'text.primary',
        }}
      >
        {t(subheader)}
      </ListSubheader>

      {data.map((item) => (
        <NavItem
          key={item.title}
          title={item.title}
          path={item.path}
          active={pathname === item.path || pathname === `${item.path}/`}
          subItem
        />
      ))}
    </Stack>
  );
}
