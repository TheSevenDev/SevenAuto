import InputAdornment from '@mui/material/InputAdornment';
import {
  DateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import Iconify from 'modules/components/iconify';
import { Controller, useFormContext } from 'react-hook-form';
// ----------------------------------------------------------------------

type Props = DateTimePickerProps & {
  name: string;
  clearable?: boolean;
};

export default function RHFDateTime({
  name,
  clearable = true,
  ...other
}: Props) {
  const { control, trigger } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          value={field.value || null}
          onChange={(date) => {
            field.onChange(date);
            trigger(name);
          }}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error?.message,
              ...(clearable &&
                field.value && {
                  slotProps: {
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          onClick={() => {
                            field.onChange(null);
                            trigger(name);
                          }}
                          sx={{
                            cursor: 'pointer',
                          }}
                        >
                          <Iconify icon="mdi:close" />
                        </InputAdornment>
                      ),
                    },
                  },
                }),
            },
          }}
          {...other}
        />
      )}
    />
  );
}
