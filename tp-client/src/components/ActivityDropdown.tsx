import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { fetchActivities } from '../services/fetch';
import { Option } from '../classes/types';

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const ActivityDropdown = ({ value, onChange }: Props) => {
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

    fetchActivities(value)
      .then((data) => {
        const match = data.find((o) => o.code === value);
        if (match) {
          setSelected(match);
          setSearchValue('');
        }
      })
      .catch((err) => console.error('Tegevusala otsing ebaõnnestus:', err));
  }, [value]);

  useEffect(() => {
    if (searchValue.length < 2 || !/[a-zA-ZäöüõÄÖÜÕ0-9]/.test(searchValue)) return;

    setLoading(true);
    const controller = new AbortController();

    fetchActivities(searchValue)
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
      options={combinedOptions}
      getOptionLabel={(o) => o.name}
      value={selected}
      fullWidth
      onChange={(_, newValue) => {
        setSelected(newValue);
        onChange(newValue?.code || null);
        setSearchValue('');
      }}
      inputValue={searchValue || selected?.name || ''}
      onInputChange={(_, val, reason) => {
        if (reason === 'input') {
          setSearchValue(val);
        }
        if (reason === 'clear' || reason === 'reset') {
          setSearchValue('');
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tegevusala"
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
        searchValue.length < 2 ? 'Alusta sisestamist' : 'Otsitavat tegevusala ei leitud'
      }
      clearOnBlur={false}
      autoHighlight
    />
  );
};
