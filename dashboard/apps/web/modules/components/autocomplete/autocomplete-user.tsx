import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { getDisplayName, IUser, IUserFindMany } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { queryName } from 'modules/const/query-name';
import apiServices from 'modules/services/apiService';
import { useRef, useState } from 'react';

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
  error?: boolean;
}

export default function AutocompleteUser<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  placeholder,
  helperText,
  excludeIds,
  error,
  ...other
}: Omit<
  Props<IUser, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'options' | 'getOptionLabel' | 'renderOption' | 'freeSolo'
>) {
  const [query, setQuery] = useState<IUserFindMany>({
    filter: '',
    ...(excludeIds && excludeIds.length > 0 ? { excludeIds } : {}),
    take: 10,
    skip: 0,
  });

  const { data: users, isFetching } = useQuery({
    queryKey: [queryName.GET_USERS, query],
    queryFn: async () => {
      const res = await apiServices.user.getUsers(query);
      return res.items || [];
    },
  });

  const debounceFetchData = useRef(
    debounce(
      (nextValue) =>
        setQuery((prev) => ({
          ...prev,
          filter: nextValue,
        })),
      500,
    ),
  ).current;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFetchData(e.target.value);
  };

  const getLabel = (option: IUser | string | undefined) => {
    if (!option) return '';
    if (typeof option === 'string') {
      const find = users?.find((role) => role.id === option);
      const label = find
        ? `${getDisplayName(find)} ${find.email ? `(${find.email})` : ``}`
        : option;
      return find ? label : option;
    }
    return `${getDisplayName(option)} ${option.email ? `(${option.email})` : ``}`;
  };

  return (
    <Autocomplete
      key={name}
      autoHighlight
      renderInput={(params) => (
        <TextField
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={helperText}
          {...params}
          onChange={handleSearch}
        />
      )}
      isOptionEqualToValue={(option, value) =>
        (option as IUser).id === (value as IUser).id
      }
      loading={isFetching}
      options={[...(users || []).map((option) => option)]}
      getOptionLabel={(option) => getLabel(option)}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getLabel(option)}
        </li>
      )}
      {...other}
    />
  );
}
