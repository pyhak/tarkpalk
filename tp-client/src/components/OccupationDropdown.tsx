import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
  Box,
} from '@mui/material';

type Option = {
  code: string;
  name: string;
  category: string;
};

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const OccupationDropdown = ({ value, onChange }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    if (selected?.code === value) return;

    fetch(`http://localhost:3000/occupations/search?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data: Option[]) => {
        const match = data.find((o) => o.code === value);
        if (match) setSelected(match);
      })
      .catch((err) => console.error('Ametit ei leitud:', err));
  }, [value]);

  useEffect(() => {
    if (searchValue.length < 2 || !/[a-zA-ZäöüõÄÖÜÕ0-9]/.test(searchValue)) return;

    setLoading(true);
    const controller = new AbortController();

    fetch(`http://localhost:3000/occupations/search?q=${encodeURIComponent(searchValue)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setOptions)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [searchValue]);

  const combinedOptions = useMemo(() => {
    if (selected && !options.some((o) => o.code === selected.code)) {
      return [selected, ...options];
    }
    return options;
  }, [options, selected]);

  return (
    <Autocomplete
      fullWidth
      options={combinedOptions}
      groupBy={(option) => option.category}
      value={selected}
      inputValue={searchValue || selected?.name || ''}
      onInputChange={(_, val, reason) => {
        if (reason === 'input') setSearchValue(val);
        if (reason === 'clear' || reason === 'reset') setSearchValue('');
      }}
      onChange={(_, newValue) => {
        setSelected(newValue);
        onChange(newValue?.code || null);
        setSearchValue('');
      }}
      getOptionLabel={(o) => o.name}
      renderOption={(props, option) => (
        <li {...props}>
          <Box pl={2}>
            <Typography variant="body2">{option.name}</Typography>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Amet"
          placeholder="Alusta sisestamist"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      isOptionEqualToValue={(o, v) => o.code === v.code}
      noOptionsText={
        searchValue.length < 2 ? 'Alusta sisestamist' : 'Otsitavat ametit ei leitud'
      }
      clearOnBlur={false}
      autoHighlight
    />
  );
};