import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { IRole } from '@seven-auto/libs';
import { debounce } from 'lodash';
import apiServices from 'modules/services/apiService';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  error?: boolean;
}

export default function AutocompleteRole<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  placeholder,
  helperText,
  error,
  ...other
}: Omit<
  Props<IRole, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'options' | 'getOptionLabel' | 'renderOption' | 'freeSolo'
>) {
  const [roles, setRoles] = useState<IRole[]>([]);

  const fetchRoles = useCallback(async (newFilter: string) => {
    try {
      const res = await apiServices.role.getRoles({
        filter: newFilter,
        take: 10,
        skip: 0,
      });
      setRoles(res.items || []);
    } catch {
      setRoles([]);
      console.error(`Can't fetch roles`);
    }
  }, []);

  const debounceFetchData = useRef(
    debounce((nextValue) => fetchRoles(nextValue), 1000),
  ).current;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFetchData(e.target.value);
  };

  useEffect(() => {
    fetchRoles('');
  }, [fetchRoles]);

  const getLabel = (option: IRole | string | undefined) => {
    if (!option) return '';
    if (typeof option === 'string') {
      const find = roles.find((role) => role.id === option);
      return find ? find.name || option : option;
    }
    return (option as IRole).name || '';
  };

  return (
    <Autocomplete
      key={name}
      autoHighlight
      renderInput={(params) => (
        <TextField
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText || ''}
          {...params}
          onChange={handleSearch}
        />
      )}
      options={[...roles.map((option) => option)]}
      getOptionLabel={(option) => getLabel(option)}
      isOptionEqualToValue={(option, value) =>
        (option as IRole).id === (value as IRole).id
      }
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getLabel(option)}
        </li>
      )}
      {...other}
    />
  );
}
