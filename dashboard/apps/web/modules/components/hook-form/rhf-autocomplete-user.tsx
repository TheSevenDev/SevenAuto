import { AutocompleteProps } from '@mui/material/Autocomplete';
import { IUser } from '@seven-auto/libs';
import { Controller, useFormContext } from 'react-hook-form';

import AutocompleteUser from '../autocomplete/autocomplete-user';

// ----------------------------------------------------------------------

interface Props<
  IUser,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<IUser, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  excludeIds?: string[];
}

export default function RHFAutocompleteUser<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  // placeholder,
  helperText,
  ...other
}: Omit<
  Props<IUser, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'options' | 'getOptionLabel' | 'renderOption' | 'freeSolo'
>) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteUser
          {...field}
          value={field.value ?? (other.multiple ? [] : null)}
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          autoHighlight
          error={!!error}
          helperText={error ? error?.message : helperText}
          label={label}
          {...other}
        />
      )}
    />
  );
}
