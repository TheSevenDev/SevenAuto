import { Controller, useFormContext } from 'react-hook-form';

import CurrencyTextField, {
  CurrencyTextFieldProps,
} from '../currency-textfield';

// ----------------------------------------------------------------------

type Props = CurrencyTextFieldProps & {
  name: string;
  isHiddenHelperText?: boolean;
};

export default function RHFCurrencyTextField({
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
        <CurrencyTextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(_value) => {
            field.onChange(_value);
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
