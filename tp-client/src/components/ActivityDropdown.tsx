import { Autocomplete, TextField } from '@mui/material';
import { activities } from '../mockData';

interface Props {
  occupationCode: string | null;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ActivityDropdown = ({ occupationCode, value, onChange }: Props) => {
  const filteredActivities = occupationCode
    ? activities.filter((a) => a.isco.includes(occupationCode))
    : activities;

  return (
    <Autocomplete
    fullWidth
      options={filteredActivities}
      getOptionLabel={(o) => o.name}
      value={filteredActivities.find((a) => a.code === value) || null}
      onChange={(_, val) => onChange(val ? val.code : null)}
      renderInput={(params) => <TextField {...params} label="Valdkond" />}
      isOptionEqualToValue={(o, v) => o.code === v.code}
      noOptionsText="Otsitavat valdkonda ei leitud"
    />
  );
};
