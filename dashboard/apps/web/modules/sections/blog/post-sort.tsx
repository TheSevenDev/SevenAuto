import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { IOrderBy } from '@seven-auto/libs';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

type Props = {
  sort: IOrderBy;
  onSort: (newValue: IOrderBy) => void;
  sortOptions: {
    key: string;
    value: IOrderBy;
    label: string;
  }[];
};

export default function PostSort({ sort, sortOptions, onSort }: Props) {
  const popover = usePopover();
  const { t } = useTranslate();
  const sortLabel =
    sortOptions.find((option) => option.value === sort)?.label || 'latest';
  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={
              popover.open
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
      >
        {t('basic.sortBy')}:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {t(`basic.sort.${sortLabel}`)}
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.key}
            selected={sort === option.value}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {t(`basic.sort.${option.label}`)}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
