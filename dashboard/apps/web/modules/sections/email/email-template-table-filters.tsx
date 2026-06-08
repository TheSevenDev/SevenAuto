import { Box, Button, Chip, Paper, Stack, StackProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { IFindMany, IUserFindMany } from '@seven-auto/libs';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

type Props = {
  filters: IFindMany;
  onFilters: (filters: IUserFindMany) => void;
};

export default function EmailTemplateTableFilters({
  filters,
  onFilters,
}: Props) {
  const popover = usePopover();
  const { t } = useTranslate();

  const canReset = !!filters.filter;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters({
        filter: event.target.value,
      });
    },
    [onFilters],
  );

  const handleRemoveFilter = useCallback(() => {
    onFilters({
      filter: '',
    });
  }, [onFilters]);

  const onResetFilters = useCallback(() => {
    onFilters({
      filter: '',
    });
  }, [onFilters]);

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: { xs: 'flex-end', md: 'center' },
          px: 2.5,
          pt: 1.5,
          pb: 0.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: 1,
            flexDirection: 'row',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <TextField
            fullWidth
            value={filters.filter}
            onChange={handleFilterName}
            placeholder={t('basic.search_placeholder')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={ICONS_NAME.search}
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon={ICONS_NAME.more} />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        spacing={1.5}
        sx={{
          pb: 0.5,
          px: 2.5,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {!!filters.filter && (
            <Block label={`${t('users.filter')}:`}>
              <Chip
                label={filters.filter}
                size="small"
                onDelete={() => handleRemoveFilter()}
              />
            </Block>
          )}

          {canReset && (
            <Button
              color="error"
              onClick={onResetFilters}
              startIcon={<Iconify icon={ICONS_NAME.delete} />}
            >
              {t('basic.reset')}
            </Button>
          )}
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          {t('basic.print')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          {t('basic.import')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          {t('basic.export')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {children}
      </Stack>
    </Stack>
  );
}
