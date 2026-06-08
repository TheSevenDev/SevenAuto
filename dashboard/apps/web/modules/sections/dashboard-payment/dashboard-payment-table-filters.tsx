import { Box, Button, Chip, Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import {
  EPaymentType,
  getDisplayName,
  IPaymentFindMany,
  IUser,
} from '@seven-auto/libs';
import { endOfDay, startOfDay } from 'date-fns';
import AutocompleteUser from 'modules/components/autocomplete/autocomplete-user';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { fDate } from 'modules/utils/format-time';
import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  userId?: string;
  filters: IPaymentFindMany;
  onFilters: React.Dispatch<React.SetStateAction<IPaymentFindMany>>;
};

export default function PaymentTableFilters({
  userId,
  filters,
  onFilters,
}: Props) {
  const { t } = useTranslate();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const canReset =
    !!filters.filter ||
    !!filters.type?.length ||
    (!userId && !!filters.userId?.length) ||
    !!filters.createdAt_gte ||
    !!filters.createdAt_lte;

  const dateError =
    filters.createdAt_gte && filters.createdAt_lte
      ? new Date(filters.createdAt_gte).getTime() >
        new Date(filters.createdAt_lte).getTime()
      : false;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters((prev) => ({
        ...prev,
        filter: event.target.value,
      }));
    },
    [onFilters],
  );

  const handleFilterType = useCallback(
    (event: SelectChangeEvent<EPaymentType>) => {
      onFilters((prev) => ({
        ...prev,
        type: event.target.value as EPaymentType,
      }));
    },
    [onFilters],
  );

  const handleRemoveType = useCallback(() => {
    onFilters((prev) => ({
      ...prev,
      type: undefined,
    }));
  }, [onFilters]);

  const handleRemoveFilter = useCallback(() => {
    onFilters((prev) => ({
      ...prev,
      filter: '',
    }));
  }, [onFilters]);

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters((prev) => ({
        ...prev,
        createdAt_gte: newValue ? startOfDay(newValue) : undefined,
      }));
    },
    [onFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters((prev) => ({
        ...prev,
        createdAt_lte: newValue ? endOfDay(newValue) : undefined,
      }));
    },
    [onFilters],
  );

  const onResetFilters = useCallback(() => {
    onFilters((prev) => ({
      ...prev,
      filter: '',
      type: undefined,
      userId: userId || undefined,
      createdAt_gte: undefined,
      createdAt_lte: undefined,
    }));
    setSelectedUser(null);
  }, [onFilters, userId]);

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        {!userId && (
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 150 } }}>
            <AutocompleteUser
              name="userId"
              label={t('basic.user')}
              value={selectedUser}
              onChange={(event, value) => {
                onFilters((prev) => ({
                  ...prev,
                  userId: (value as IUser)?.id || undefined,
                }));
                setSelectedUser(value as IUser | null);
              }}
            />
          </FormControl>
        )}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 150 } }}>
          <InputLabel>{t('payments.method')}</InputLabel>
          <Select
            value={filters.type || ''}
            onChange={handleFilterType}
            input={<OutlinedInput label={t('payments.method')} />}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: { maxHeight: 240 },
                },
              },
            }}
          >
            {Object.values(EPaymentType)
              .filter((value) => typeof value === 'string')
              .map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`payments.methods.${value}`)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <DatePicker
          label={t('basic.startDate')}
          value={filters.createdAt_gte ? new Date(filters.createdAt_gte) : null}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true, error: dateError } }}
          sx={{
            maxWidth: { md: 140 },
          }}
        />

        <DatePicker
          label={t('basic.endDate')}
          value={filters.createdAt_lte ? new Date(filters.createdAt_lte) : null}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true, error: dateError } }}
          sx={{
            maxWidth: { md: 140 },
          }}
        />
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
            value={filters.filter || ''}
            onChange={handleFilterName}
            placeholder={t('basic.search')}
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
        </Stack>
      </Stack>
      <Stack spacing={1.5} sx={{ px: 0, py: 1 }}>
        <Stack
          spacing={1}
          sx={{
            width: 1,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {!!selectedUser && (
            <Block label={`${t('basic.user')}:`}>
              <Chip
                label={getDisplayName(selectedUser) || t('basic.unknownUser')}
                size="small"
                onDelete={() => {
                  onFilters((prev) => ({
                    ...prev,
                    userId: undefined,
                  }));
                  setSelectedUser(null);
                }}
              />
            </Block>
          )}
          {!!filters.filter && (
            <Block label={`${t('basic.filter')}:`}>
              <Chip
                label={filters.filter}
                size="small"
                onDelete={() => handleRemoveFilter()}
              />
            </Block>
          )}

          {!!filters.type && (
            <Block label={`${t('payments.method')}:`}>
              <Chip
                label={t(`payments.methods.${filters.type}`)}
                size="small"
                onDelete={() => handleRemoveType()}
              />
            </Block>
          )}

          {!!filters.createdAt_gte && (
            <Block label={`${t('basic.startDate')}:`}>
              {filters.createdAt_gte && (
                <Chip
                  label={`${fDate(filters.createdAt_gte) || ''}`}
                  size="small"
                  onDelete={() => {
                    onFilters((prev) => ({
                      ...prev,
                      createdAt_gte: undefined,
                    }));
                  }}
                />
              )}
            </Block>
          )}

          {!!filters.createdAt_lte && (
            <Block label={`${t('basic.endDate')}:`}>
              {filters.createdAt_lte && (
                <Chip
                  label={`${fDate(filters.createdAt_lte) || ''}`}
                  size="small"
                  onDelete={() => {
                    onFilters((prev) => ({
                      ...prev,
                      createdAt_lte: undefined,
                    }));
                  }}
                />
              )}
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
