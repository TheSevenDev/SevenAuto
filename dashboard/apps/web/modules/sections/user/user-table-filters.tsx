import { Box, Button, Checkbox, Chip, Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  EUserLevel,
  EUserStatus,
  IRole,
  IUserFindMany,
} from '@seven-auto/libs';
import _ from 'lodash';
import AutocompleteRole from 'modules/components/autocomplete/autocomplete-role';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

type Props = {
  filters: IUserFindMany;
  onFilters: (filters: IUserFindMany) => void;
};

export default function UserTableFilters({ filters, onFilters }: Props) {
  const popover = usePopover();
  const { t } = useTranslate();

  const canReset =
    !!filters.filter ||
    !!filters.levels?.length ||
    !!filters.referrerId ||
    (!!filters.startDate && !!filters.endDate);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters({
        filter: event.target.value,
      });
    },
    [onFilters],
  );

  const handleFilterLevel = useCallback(
    (event: SelectChangeEvent<EUserStatus[]>) => {
      onFilters({
        levels:
          typeof event.target.value === 'string'
            ? [event.target.value]
            : event.target.value,
      });
    },
    [onFilters],
  );

  const handleRemoveLevel = useCallback(
    (role: EUserStatus) => {
      onFilters({
        levels: filters.levels?.filter((item) => item !== role),
      });
    },
    [onFilters, filters.levels],
  );

  const handleFilterRole = useCallback(
    (roleId: string) => {
      onFilters({
        roleId,
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
      levels: [],
    });
  }, [onFilters]);

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: { xs: 'flex-end', md: 'center' },
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t('users.level')}</InputLabel>
          <Select
            multiple
            value={filters.levels || []}
            onChange={handleFilterLevel}
            input={<OutlinedInput label={t('users.level')} />}
            renderValue={(selected) =>
              selected
                .map((value) => _.capitalize(value.toLowerCase()))
                .join(', ')
            }
            MenuProps={{
              slotProps: {
                paper: {
                  sx: { maxHeight: 240 },
                },
              },
            }}
          >
            {Object.values(EUserLevel)
              .filter((value) => typeof value === 'string')
              .map((value) => (
                <MenuItem key={value} value={value}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={filters.levels?.includes(value)}
                  />
                  {_.capitalize(value.toLowerCase())}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <AutocompleteRole
            name="roleId"
            label={t('users.role')}
            value={filters.roleId || null}
            onChange={(event, newValue) => {
              const val = newValue as IRole;
              if (val && val.id) {
                handleFilterRole(val.id);
              } else {
                handleFilterRole('');
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value}
          />
        </FormControl>

        <Stack
          direction="row"
          spacing={2}
          sx={{ width: 1, alignItems: 'center', flexGrow: 1 }}
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
                      icon="eva:search-fill"
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
          pb: 2.5,
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

          {!!filters.levels?.length && (
            <Block label={`${t('users.level')}:`}>
              {filters.levels?.map((item) => (
                <Chip
                  key={item}
                  label={_.capitalize(item.toLowerCase())}
                  size="small"
                  onDelete={() => handleRemoveLevel(item)}
                />
              ))}
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

      <Stack spacing={1} direction="row" sx={{ flexWrap: 'wrap' }}>
        {children}
      </Stack>
    </Stack>
  );
}
