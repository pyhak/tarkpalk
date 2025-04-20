import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

type Option = {
  code: string;
  name: string;
};

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const ActivityDropdown = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  // Lae valitud tegevusala, kui kood teada
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    fetch(`http://localhost:3000/activities/search?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data: Option[]) => {
        const match = data.find((o) => o.code === value);
        if (match) {
          setSelected(match);
          setInputValue(match.name);
        }
      })
      .catch((err) => console.error('Tegevusala otsing ebaõnnestus:', err));
  }, [value]);

  // Otsing sisendi järgi
  useEffect(() => {
    if (inputValue.length < 2) return;

    setLoading(true);
    const controller = new AbortController();

    fetch(`http://localhost:3000/activities/search?q=${encodeURIComponent(inputValue)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setOptions)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [inputValue]);

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
        setInputValue(newValue?.name || '');
        onChange(newValue?.code || null);
      }}
      inputValue={inputValue}
      onInputChange={(_, val, reason) => {
        if (reason === 'input') {
          setInputValue(val);
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
        inputValue.length < 2 ? 'Alusta sisestamist' : 'Otsitavat tegevusala ei leitud'
      }
      clearOnBlur={false}
      autoHighlight
    />
  );
};
