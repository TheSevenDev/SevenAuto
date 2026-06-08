import { AutocompleteProps } from '@mui/material/Autocomplete';
import { IRole } from '@seven-auto/libs';
import { Controller, useFormContext } from 'react-hook-form';

import AutocompleteRole from '../autocomplete/autocomplete-role';

// ----------------------------------------------------------------------

interface Props<
  IRole,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<IRole, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutocompleteRole<
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
  Props<IRole, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'options' | 'getOptionLabel' | 'renderOption' | 'freeSolo'
>) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AutocompleteRole
          {...field}
          value={field.value ?? (other.multiple ? [] : null)}
          autoHighlight
          error={!!error}
          helperText={error ? error?.message : helperText}
          label={label}
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          {...other}
        />
      )}
    />
  );
}
