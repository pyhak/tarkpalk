import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { fetchOccupations } from '../services/fetch';
import { Option } from '../classes/types';

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

    fetchOccupations(value)
      .then((data) => {
        const match = data.find((o) => o.code === value);
        if (match) {
          setSelected(match);
        }
      })
      .catch((err) => console.error('Ametit ei leitud:', err));
  }, [value, selected?.code]);

  useEffect(() => {
    if (searchValue.length < 2 || !/[a-zA-ZäöüõÄÖÜÕ0-9]/.test(searchValue)) return;

    setLoading(true);
    const controller = new AbortController();

    fetchOccupations(searchValue)
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
      getOptionLabel={(o) => {
        const isTopLevel = o.code.length === 1;
        const indent = isTopLevel ? '' : '\u00A0\u00A0\u00A0\u00A0';
        return `${indent}${o.name}`;
      }}
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
      renderOption={(props, option) => {
        const isTopLevel = option.code.length === 1;
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <span style={{ paddingLeft: isTopLevel ? 0 : 16 }}>{option.name}</span>
          </li>
        );
      }}
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