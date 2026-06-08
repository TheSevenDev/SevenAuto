import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SxProps, Theme } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { EUserLevel } from '@seven-auto/libs';
import { useTranslate } from 'modules/locales';
import { getUserLevelColor } from 'modules/store/user/user.utils';
import { Controller, useFormContext } from 'react-hook-form';

import Label from '../label';

// ----------------------------------------------------------------------

type RHFSelectUserLevelProps = TextFieldProps & {
  name: string;
  native?: boolean;
  maxHeight?: boolean | number;
  PaperPropsSx?: SxProps<Theme>;
};

export function RHFSelectUserLevel({
  name,
  native,
  maxHeight = 220,
  helperText,
  PaperPropsSx,
  ...other
}: RHFSelectUserLevelProps) {
  const { control, trigger } = useFormContext();
  const { t } = useTranslate();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          slotProps={{
            select: {
              native,
              MenuProps: {
                slotProps: {
                  paper: {
                    sx: {
                      ...(!native && {
                        maxHeight:
                          typeof maxHeight === 'number' ? maxHeight : 'unset',
                      }),
                      ...PaperPropsSx,
                    },
                  },
                },
              },
              sx: { textTransform: 'capitalize' },
            },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          onChange={(event) => {
            field.onChange(event.target.value);
            trigger(name);
          }}
          {...other}
        >
          {Object.values(EUserLevel)
            .filter((value) => typeof value === 'string')
            .map((value) => (
              <MenuItem key={value} value={value}>
                <Label color={getUserLevelColor(value)}>
                  {t(`levels.${value}`)}
                </Label>
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = FormControlProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
};

export function RHFMultiSelectUserLevel({
  name,
  chip,
  label,
  checkbox,
  placeholder,
  helperText,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();
  const { t } = useTranslate();
  const options = Object.values(EUserLevel).map((value) => ({
    label: value,
    value,
  }));

  const renderValues = (selectedIds: string[]) => {
    const selectedItems = options.filter((item) =>
      selectedIds.includes(item.value),
    );

    if (!selectedItems.length && placeholder) {
      return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip
              key={item.value}
              size="small"
              label={t(`levels.${item.value}`)}
            />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            id={`multiple-${name}`}
            labelId={name}
            label={label}
            renderValue={renderValues}
          >
            {options.map((option) => {
              const selected = field.value.includes(option.value);

              return (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && (
                    <Checkbox size="small" disableRipple checked={selected} />
                  )}

                  <Label color={getUserLevelColor(option.value)}>
                    {t(`levels.${option.value}`)}
                  </Label>
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
