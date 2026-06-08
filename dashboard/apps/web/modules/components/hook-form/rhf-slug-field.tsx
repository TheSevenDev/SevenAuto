import { Button, InputAdornment } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { Controller, useFormContext } from 'react-hook-form';
import slugify from 'slugify';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  baseName: string;
  isHiddenHelperText?: boolean;
};

export default function RHFSlugField({
  name,
  baseName,
  helperText,
  isHiddenHelperText = false,
  ...other
}: Props) {
  const { t } = useTranslate();
  const { control, trigger, watch } = useFormContext();
  const valueBase = watch(baseName);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value}
          onChange={(event) => {
            field.onChange(event.target.value);
            trigger(name);
          }}
          error={!!error}
          helperText={
            isHiddenHelperText ? '' : error ? error?.message : helperText
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    aria-label="generate slug"
                    onClick={() => {
                      field.onChange(
                        slugify(valueBase || '', { lower: true, strict: true }),
                      );
                      trigger(name);
                    }}
                    variant="contained"
                    color="inherit"
                    disabled={!valueBase}
                    size="small"
                  >
                    <Iconify icon={ICONS_NAME.generate} sx={{ mr: 0.5 }} />
                    {t('basic.generate')}
                  </Button>
                </InputAdornment>
              ),
            },
          }}
          {...other}
        />
      )}
    />
  );
}
