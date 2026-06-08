import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  isHiddenHelperText?: boolean;
};

export default function RHFTextField({
  name,
  helperText,
  type,
  isHiddenHelperText = false,
  ...other
}: Props) {
  const { control, trigger } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={
            type === 'number' && field.value === 0 ? '' : (field.value ?? '')
          }
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
            trigger(name);
          }}
          error={!!error}
          helperText={
            isHiddenHelperText ? '' : error ? error?.message : helperText
          }
          {...other}
        />
      )}
    />
  );
}
