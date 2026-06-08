import {
  MenuItem,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
} from '@mui/material';
import { useTranslate } from 'modules/locales';

import Label from '../label';

export type SelectBooleanProps = TextFieldProps & {
  native?: boolean;
  maxHeight?: boolean | number;
  PaperPropsSx?: SxProps<Theme>;
  value?: boolean;
  onChange?: (value: boolean) => void;
};

export function SelectBoolean({
  native,
  maxHeight,
  PaperPropsSx,
  value,
  onChange,
  ...other
}: SelectBooleanProps) {
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
      value={value ? 'true' : 'false'}
      onChange={(event) => {
        onChange?.(event.target.value === 'true');
      }}
      {...other}
    >
      <MenuItem value="true">
        <Label color="success">{t('basic.active')}</Label>
      </MenuItem>
      <MenuItem value="false">
        <Label color="error">{t('basic.inactive')}</Label>
      </MenuItem>
    </TextField>
  );
}
