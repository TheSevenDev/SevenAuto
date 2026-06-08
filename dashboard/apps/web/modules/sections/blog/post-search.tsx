import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useDebounce } from 'modules/hooks/use-debounce';
import { useTranslate } from 'modules/locales';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
type Props = {
  onFilterChange?: (filter: string) => void;
  sx?: SxProps<Theme>;
};

export default function PostSearch({ onFilterChange, sx }: Props) {
  const { t } = useTranslate();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery, 500);

  const handleSearch = (inputValue: string) => {
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    onFilterChange?.(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <TextField
      sx={{ width: { xs: 1, sm: 260 }, ...sx }}
      placeholder={t('basic.search')}
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ ml: 1, color: 'text.disabled' }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {searchQuery ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')}>
                    <Iconify
                      icon={ICONS_NAME.close}
                      sx={{ color: 'text.secondary' }}
                    />
                  </IconButton>
                </InputAdornment>
              ) : null}
            </>
          ),
        },
      }}
    />
  );
}
