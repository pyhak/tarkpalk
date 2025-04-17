import { Autocomplete, TextField } from '@mui/material';
import { occupations } from '../mockData';

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const OccupationDropdown = ({ value, onChange }: Props) => (
  <Autocomplete
  fullWidth
    options={occupations}
    getOptionLabel={(o) => o.name}
    value={occupations.find((o) => o.code === value) || null}
    onChange={(_, val) => onChange(val ? val.code : null)}
    renderInput={(params) => <TextField {...params} label="Amet" />}
    isOptionEqualToValue={(o, v) => o.code === v.code}
    noOptionsText="Otsitavat ametit ei leitud"
  />
);