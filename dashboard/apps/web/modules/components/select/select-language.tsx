import {
  Stack,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { ELanguage } from '@seven-auto/libs';
import { languageIcons, useTranslate } from 'modules/locales';

import Iconify from '../iconify';

export type SelectLanguageProps = TextFieldProps & {
  native?: boolean;
  maxHeight?: boolean | number;
  PaperPropsSx?: SxProps<Theme>;
};

export function SelectLanguage({
  native,
  maxHeight,
  PaperPropsSx,
  ...other
}: SelectLanguageProps) {
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
      {Object.values(ELanguage)
        .filter((value) => typeof value === 'string')
        .map((value) => (
          <MenuItem key={value} value={value}>
            <Stack
              component="div"
              direction="row"
              sx={{ alignItems: 'center', gap: 1 }}
            >
              <Iconify icon={languageIcons[value]} />
              <Typography variant="body2">{t(`languages.${value}`)}</Typography>
            </Stack>
          </MenuItem>
        ))}
    </TextField>
  );
}
