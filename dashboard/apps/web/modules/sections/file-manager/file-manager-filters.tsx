import { Chip, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';
import Stack, { StackProps } from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { EMediaType } from '@seven-auto/libs';
import { endOfDay, startOfDay } from 'date-fns';
import _ from 'lodash';
import CustomDateRangePicker, {
  shortDateLabel,
} from 'modules/components/custom-date-range-picker';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import FileThumbnail from 'modules/components/file-thumbnail';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { useCallback, useEffect, useState } from 'react';
// ----------------------------------------------------------------------

type Props = {
  view: string;
  onChangeView: (newView: string) => void;
};

export default function FileManagerFilters({ view, onChangeView }: Props) {
  const { t } = useTranslate();
  const openDateRange = useBoolean();

  const { medias, filters, setFilters, resetFilters } = useMediaStore();
  const [currentTypes, setCurrentTypes] = useState<string[]>(
    filters.types || [],
  );

  const dateError =
    filters.updatedAt_gte && filters.updatedAt_lte
      ? filters.updatedAt_gte.getTime() > filters.updatedAt_lte.getTime()
      : false;

  const canReset =
    !!filters.filter ||
    !!filters.types?.length ||
    !!filters.source ||
    !!filters.ext ||
    (!!filters.updatedAt_gte && !!filters.updatedAt_lte);

  const shortLabel = shortDateLabel(
    filters.updatedAt_gte || null,
    filters.updatedAt_lte || null,
  );

  const popover = usePopover();

  const renderLabel = filters.types?.length
    ? filters.types
        ?.slice(0, 2)
        .map((type) => _.startCase(_.toLower(type)))
        .join(',')
    : 'All type';

  const handleFilterTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({
        filter: event.target.value,
      });
    },
    [setFilters],
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      setFilters({
        updatedAt_gte: newValue ? startOfDay(newValue) : undefined,
      });
    },
    [setFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      setFilters({
        updatedAt_lte: newValue ? endOfDay(newValue) : undefined,
      });
    },
    [setFilters],
  );

  const handleFilterType = useCallback(
    (newValue: string) => {
      const checked = currentTypes?.includes(newValue)
        ? currentTypes?.filter((value) => value !== newValue)
        : [...(currentTypes || []), newValue];

      setCurrentTypes(checked);
    },
    [currentTypes],
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    setFilters({ types: [] });
  }, [setFilters, popover]);

  const handleRemoveTypes = useCallback(
    (type: string) => {
      setFilters({
        types: filters.types?.filter((value) => value !== type),
      });
    },
    [filters.types, setFilters],
  );

  const handleRemoveDate = useCallback(() => {
    setFilters({
      updatedAt_gte: undefined,
      updatedAt_lte: undefined,
    });
  }, [setFilters]);

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        onChangeView(newView);
      }
    },
    [onChangeView],
  );

  const handleApplyType = useCallback(() => {
    setFilters({
      types: currentTypes,
    });
    popover.onClose();
  }, [currentTypes, setFilters, popover]);

  const renderFilterName = (
    <TextField
      value={filters.filter || ''}
      onChange={handleFilterTitle}
      placeholder={t('basic.search_placeholder')}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: { xs: 1, md: 260 },
      }}
    />
  );

  useEffect(() => {
    setCurrentTypes(filters.types || []);
  }, [filters.types]);

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={
              popover.open
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderLabel}
        {filters.types && filters.types?.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.types.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ p: 2.5 }}
      >
        <Stack spacing={2.5}>
          <Box
            sx={{
              gap: 1,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(4, 1fr)',
              },
            }}
          >
            {Object.values(EMediaType).map((type) => {
              const selected = currentTypes?.includes(type);
              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterType(type)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) =>
                      `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <FileThumbnail file={type.toLowerCase()} />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>
                      {_.startCase(_.toLower(type))}
                    </Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack
            direction="row"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleResetType}
            >
              {t('basic.clear')}
            </Button>

            <Button variant="contained" onClick={handleApplyType}>
              {t('basic.apply')}
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterDate = (
    <>
      <Button
        color="inherit"
        onClick={openDateRange.onTrue}
        endIcon={
          <Iconify
            icon={
              openDateRange
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
            sx={{ ml: -0.5 }}
          />
        }
      >
        {!!filters.updatedAt_gte && !!filters.updatedAt_lte
          ? shortDateLabel(filters.updatedAt_gte, filters.updatedAt_lte)
          : 'Select Date'}
      </Button>

      <CustomDateRangePicker
        variant="calendar"
        startDate={filters.updatedAt_gte || null}
        endDate={filters.updatedAt_lte || null}
        onChangeStartDate={handleFilterStartDate}
        onChangeEndDate={handleFilterEndDate}
        open={openDateRange.value}
        onClose={openDateRange.onFalse}
        selected={!!filters.updatedAt_gte && !!filters.updatedAt_lte}
        error={dateError}
      />
    </>
  );

  const renderResults = (
    <Stack spacing={1.5}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{medias.length} </strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        spacing={1}
        direction="row"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {!!filters.types?.length && (
          <Block label="Types:">
            {filters.types?.map((item) => (
              <Chip
                key={item}
                label={_.startCase(_.toLower(item))}
                size="small"
                onDelete={() => handleRemoveTypes(item)}
              />
            ))}
          </Block>
        )}

        {filters.updatedAt_gte && filters.updatedAt_lte && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={resetFilters}
            startIcon={<Iconify icon={ICONS_NAME.delete} />}
          >
            {t('basic.clear')}
          </Button>
        )}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <Stack
          spacing={1}
          sx={{
            width: 1,
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-end', md: 'center' },
          }}
        >
          {renderFilterName}

          <Stack
            spacing={1}
            direction="row"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            {renderFilterDate}

            {renderFilterType}
          </Stack>
        </Stack>

        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={handleChangeView}
        >
          <ToggleButton value="list">
            <Iconify icon="solar:list-bold" />
          </ToggleButton>

          <ToggleButton value="grid">
            <Iconify icon="mingcute:dot-grid-fill" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {canReset && renderResults}
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
