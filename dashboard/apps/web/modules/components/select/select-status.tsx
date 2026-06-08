import {
  Box,
  Checkbox,
  FormControl,
  FormControlProps as MuiFormControlProps,
  InputLabel,
  OutlinedInput,
  Select,
  SelectProps,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { EStatus } from '@seven-auto/libs';
import { useTranslate } from 'modules/locales';
import { getStatusColor } from 'modules/utils/general';

import Label from '../label';

export type SelectStatusProps = TextFieldProps & {
  native?: boolean;
  maxHeight?: boolean | number;
  PaperPropsSx?: SxProps<Theme>;
};

export function SelectStatus({
  native,
  maxHeight,
  PaperPropsSx,
  ...other
}: SelectStatusProps) {
  const { t } = useTranslate();

  return (
    <TextField
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
      {...other}
    >
      {Object.values(EStatus)
        .filter((value) => typeof value === 'string')
        .map((value) => (
          <MenuItem key={value} value={value}>
            <Label color={getStatusColor(value)}>{t(`status.${value}`)}</Label>
          </MenuItem>
        ))}
    </TextField>
  );
}

type SelectStatusMultiProps = SelectProps & {
  label?: string;
  value?: EStatus[];
  FormControlProps?: MuiFormControlProps;
};

export function SelectStatusMulti({
  label,
  value,
  FormControlProps,
  ...other
}: SelectStatusMultiProps) {
  const { t } = useTranslate();
  return (
    <FormControl
      sx={{
        flexShrink: 0,
        minWidth: 150,
      }}
      {...FormControlProps}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value || []}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <>
              {selected &&
                (selected as EStatus[]).map((status) => (
                  <Label
                    key={status}
                    color={getStatusColor(status)}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {t(`status.${status}`)}
                  </Label>
                ))}
            </>
          </Box>
        )}
        MenuProps={{
          slotProps: {
            paper: {
              sx: { maxHeight: 240 },
            },
          },
        }}
        {...other}
      >
        {Object.values(EStatus)
          .filter((status) => typeof status === 'string')
          .map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox
                disableRipple
                size="small"
                checked={value?.includes(status)}
              />
              {t(`status.${status}`)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
