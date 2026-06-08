import Collapse from '@mui/material/Collapse';
import { NavSectionVertical } from 'modules/components/nav-section';
import { useActiveLink } from 'modules/routes/hooks/use-active-link';
import { useCallback, useState } from 'react';

import { NavItemSubheaderProps, NavListProps } from '../types';
import { NavItem } from './nav-item';

// ----------------------------------------------------------------------

export default function NavList({ data }: NavListProps) {
  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(false);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  const hasChildren = data.children && data.children.length > 0;
  const isSubheader = data.type === 'subheader';

  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        //
        title={data.title}
        path={data.path}
        icon={data.icon}
        //
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        //
        active={active}
      />

      {hasChildren && (
        <Collapse in={openMenu} unmountOnExit>
          {isSubheader ? (
            <NavSectionVertical
              data={data.children as NavItemSubheaderProps[]}
              slotProps={{
                rootItem: {
                  minHeight: 36,
                },
              }}
            />
          ) : (
            <>
              {data.children?.map((item) => {
                if (!('title' in item)) return null;
                return (
                  <NavItem
                    key={item.title}
                    title={item.title}
                    path={item.path}
                  />
                );
              })}
            </>
          )}
        </Collapse>
      )}
    </>
  );
}
