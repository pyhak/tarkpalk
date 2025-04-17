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

export const OccupationDropdown = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedOption = useMemo(
    () => options.find((o) => o.code === value) || null,
    [options, value]
  );

  useEffect(() => {
    if (inputValue.length < 2) return;

    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`http://localhost:3000/occupations/search?q=${encodeURIComponent(inputValue)}`, {
      signal,
    })
      .then((res) => res.json())
      .then(setOptions)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Ametite otsing ebaõnnestus:', err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [inputValue]);

  return (
    <Autocomplete
    fullWidth
      options={options}
      getOptionLabel={(o) => o.name}
      value={selectedOption}
      onChange={(_, val) => onChange(val ? val.code : null)}
      inputValue={inputValue}
      onInputChange={(_, val) => setInputValue(val)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Amet"
          placeholder="Sisesta vähemalt 2 tähemärki"
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
        inputValue.length < 2 ? 'Alusta sisestamist' : 'Otsitavat ametit ei leitud'
      }
    />
  );
};
