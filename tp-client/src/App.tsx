import { useState } from 'react';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Button, Stack } from '@mui/material';
import { OccupationDropdown } from './components/OccupationDropdown';
import { ActivityDropdown } from './components/ActivityDropdown';
import './App.css';
import { activities } from './mockData'; // too mock tegevused sisse


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const FormContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));


function App() {
  const [occupation, setOccupation] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  const handleOccupationChange = (val: string | null) => {
    setOccupation(val);

    // kui valiti amet, siis leia esimene sobiv valdkond ja pane aktiivseks
    if (val) {
      const relatedActivity = activities.find((a) => a.isco.includes(val));
      setActivity(relatedActivity?.code || null);
    } else {
      setActivity(null);
    }
  };

  const handleActivityChange = (val: string | null) => {
    setActivity(val);
  
    if (val) {
      const selectedActivity = activities.find((a) => a.code === val);
  
      if (selectedActivity && occupation && !selectedActivity.isco.includes(occupation)) {
        setOccupation(null); // tühista amet kui see ei sobi valdkonnaga
      }
    } else {
      // Kui valdkond nullitakse, tühista ka amet
      setOccupation(null);
    }
  };

  return (
    <>
      <FormContainer>
        <Card>
          <h1>Palga otsing</h1>
          <p>Palga otsing on tööriist, mis aitab sul leida infot vasta valdkonna või ameti palga kohta.</p>
          <Stack spacing={3} alignItems="center" padding={4}>
            <OccupationDropdown value={occupation} onChange={handleOccupationChange} />
            <ActivityDropdown occupationCode={occupation} value={activity} onChange={handleActivityChange} />
            <Button
              variant="contained"
              color="primary"
              disabled={!activity}
              onClick={() => console.log('Pärin palgaandmed valdkonna koodi:', activity)}
            >
              Otsi palga andmed
            </Button>
          </Stack>
        </Card>
      </FormContainer>
    </>
  )
}

export default App
