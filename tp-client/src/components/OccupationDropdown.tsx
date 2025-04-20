import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

type Option = {
  code: string;
  name: string;
};

type Props = {
  value: string | null; // selected code
  onChange: (value: string | null) => void;
};

export const OccupationDropdown = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  // 🚀 Lae valitud väärtus, kui kood muutub (nt väljastpoolt)
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    // kui juba olemas, ära tee fetchi
    if (selected?.code === value) return;

    fetch(`http://localhost:3000/occupations/search?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data: Option[]) => {
        const match = data.find((o) => o.code === value);
        if (match) {
          setSelected(match);
          setInputValue(match.name);
        }
      })
      .catch((err) => console.error('Valitud ametit ei leitud:', err));
  }, [value]);

  // 🔍 Tee otsing sisendi järgi
  useEffect(() => {
    if (inputValue.length < 2) return;

    setLoading(true);
    const controller = new AbortController();

    fetch(`http://localhost:3000/occupations/search?q=${encodeURIComponent(inputValue)}`, {
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

  // 🧩 Lisa selected ka options hulka kui vaja
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
        if (reason === 'input') setInputValue(val);
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
      isOptionEqualToValue={(option, value) => option.code === value.code}
      noOptionsText={
        inputValue.length < 2 ? 'Alusta sisestamist' : 'Otsitavat ametit ei leitud'
      }
      clearOnBlur={false}
      autoHighlight
    />
  );
};
