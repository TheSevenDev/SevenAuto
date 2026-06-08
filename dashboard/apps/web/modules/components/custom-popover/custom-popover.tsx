import { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover, { PopoverOrigin } from '@mui/material/Popover';

import { StyledArrow } from './styles';
import { MenuPopoverProps } from './types';
import { getPosition } from './utils';

// ----------------------------------------------------------------------

export default function CustomPopover({
  open,
  children,
  arrow = 'top-right',
  hiddenArrow,
  sx,
  ...other
}: MenuPopoverProps) {
  const { style, anchorOrigin, transformOrigin } = getPosition(arrow);
  const content = hiddenArrow ? (
    <MenuList>{children}</MenuList>
  ) : (
    <>
      <StyledArrow arrow={arrow} />
      <MenuList>{children}</MenuList>
    </>
  );

  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      disableRestoreFocus
      anchorOrigin={anchorOrigin as PopoverOrigin}
      transformOrigin={transformOrigin as PopoverOrigin}
      slotProps={{
        paper: {
          sx: {
            width: 'auto',
            overflow: 'inherit',
            ...style,
            [`& .${menuItemClasses.root}`]: {
              '& svg': {
                mr: 2,
                flexShrink: 0,
              },
            },
            ...sx,
          },
        },
      }}
      {...other}
    >
      {content}
    </Popover>
  );
}
