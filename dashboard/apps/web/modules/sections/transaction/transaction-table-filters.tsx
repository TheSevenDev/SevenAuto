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
  EBalanceType,
  EStatusProcess,
  ETransactionType,
  getDisplayName,
  ITransactionFindMany,
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
  filters: ITransactionFindMany;
  onFilters: React.Dispatch<React.SetStateAction<ITransactionFindMany>>;
};

export default function TransactionTableFilters({
  userId,
  filters,
  onFilters,
}: Props) {
  const { t } = useTranslate();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const canReset =
    !!filters.filter ||
    !!filters.type?.length ||
    !!filters.status?.length ||
    !!filters.balanceType?.length ||
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
    (event: SelectChangeEvent<ETransactionType>) => {
      onFilters((prev) => ({
        ...prev,
        type: event.target.value as ETransactionType,
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

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<EStatusProcess>) => {
      onFilters((prev) => ({
        ...prev,
        status: event.target.value as EStatusProcess,
      }));
    },
    [onFilters],
  );

  const handleRemoveStatus = useCallback(() => {
    onFilters((prev) => ({
      ...prev,
      status: undefined,
    }));
  }, [onFilters]);

  const handleRemoveBalanceType = useCallback(() => {
    onFilters((prev) => ({
      ...prev,
      balanceType: undefined,
    }));
  }, [onFilters]);

  const handleFilterBalanceType = useCallback(
    (event: SelectChangeEvent<EBalanceType>) => {
      onFilters((prev) => ({
        ...prev,
        balanceType: event.target.value as EBalanceType,
      }));
    },
    [onFilters],
  );

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
      status: undefined,
      balanceType: undefined,
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
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            width: 1,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: `repeat(${userId ? 3 : 4}, 1fr)`,
            },
          }}
        >
          {!userId && (
            <FormControl fullWidth sx={{ flexShrink: 0 }}>
              <AutocompleteUser
                name="userId"
                size="small"
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
          <FormControl fullWidth sx={{ flexShrink: 0 }}>
            <InputLabel size="small">{t('basic.type')}</InputLabel>
            <Select
              value={filters.type || ''}
              onChange={handleFilterType}
              size="small"
              input={<OutlinedInput label={t('basic.type')} />}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: { maxHeight: 240 },
                  },
                },
              }}
            >
              {Object.values(ETransactionType)
                .filter((value) => typeof value === 'string')
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {t(`transactions.types.${value}`)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ flexShrink: 0 }}>
            <InputLabel size="small">{t('basic.status')}</InputLabel>
            <Select
              value={filters.status || ''}
              size="small"
              onChange={handleFilterStatus}
              input={<OutlinedInput label={t('basic.status')} />}
              MenuProps={{ slotProps: { paper: { sx: { maxHeight: 240 } } } }}
            >
              {Object.values(EStatusProcess)
                .filter((value) => typeof value === 'string')
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {t(`statusProcess.${value}`)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ flexShrink: 0 }}>
            <InputLabel size="small">{t('balance.type')}</InputLabel>
            <Select
              value={filters.balanceType || ''}
              size="small"
              onChange={handleFilterBalanceType}
              input={<OutlinedInput label={t('balance.type')} />}
              MenuProps={{ slotProps: { paper: { sx: { maxHeight: 240 } } } }}
            >
              {Object.values(EBalanceType)
                .filter((value) => typeof value === 'string')
                .map((value) => (
                  <MenuItem key={value} value={value}>
                    {t(`balance.types.${value}`)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mt: 1,
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <DatePicker
          label={t('basic.startDate')}
          value={filters.createdAt_gte ? new Date(filters.createdAt_gte) : null}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: { fullWidth: true, size: 'small', error: dateError },
          }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label={t('basic.endDate')}
          value={filters.createdAt_lte ? new Date(filters.createdAt_lte) : null}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: { fullWidth: true, size: 'small', error: dateError },
          }}
          sx={{ maxWidth: { md: 200 } }}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: 1, alignItems: 'center', flexGrow: 1 }}
        >
          <TextField
            fullWidth
            size="small"
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
          direction="row"
          sx={{ flexGrow: 1, flexWrap: 'wrap', alignItems: 'center' }}
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
            <Block label={`${t('basic.type')}:`}>
              <Chip
                label={t(`transactions.types.${filters.type}`)}
                size="small"
                onDelete={() => handleRemoveType()}
              />
            </Block>
          )}

          {!!filters.status && (
            <Block label={`${t('basic.status')}:`}>
              <Chip
                label={t(`statusProcess.${filters.status}`)}
                size="small"
                onDelete={() => handleRemoveStatus()}
              />
            </Block>
          )}

          {!!filters.balanceType && (
            <Block label={`${t('balance.type')}:`}>
              <Chip
                label={t(`balance.types.${filters.balanceType}`)}
                size="small"
                onDelete={handleRemoveBalanceType}
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

      <Stack spacing={1} direction="row" sx={{ flexWrap: 'wrap' }}>
        {children}
      </Stack>
    </Stack>
  );
}
