import { useState } from 'react';
import { Button, Stack, Typography, Card as MuiCard, styled, useTheme, useMediaQuery, CircularProgress, Box } from '@mui/material';
import { OccupationDropdown } from './components/OccupationDropdown';
import { ActivityDropdown } from './components/ActivityDropdown';
import { FormattedAiResponse } from './components/FormattedAiResponse';
import './App.css';

const Card = styled(MuiCard)(({ theme }) => ({
  flex: 1,
  minWidth: 500,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '48%',
  },
}));

const LayoutContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '100dvh',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles?.('dark', {
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

function App() {
  const [occupation, setOccupation] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [mappingError, setMappingError] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOccupationChange = async (occupationCode: string | null) => {
    setOccupation(occupationCode);

    if (occupationCode) {
      try {
        const res = await fetch(`http://localhost:3000/activity-from-occupation/${occupationCode}`);
        if (res.ok) {
          const { activityCode } = await res.json();
          setActivity(activityCode);
          setMappingError(false);
        } else {
          setActivity(null);
          setMappingError(true);
        }
      } catch {
        setActivity(null);
        setMappingError(true);
      }
    } else {
      setActivity(null);
      setMappingError(false);
    }
  };

  const handleActivityChange = (activityCode: string | null) => {
    setActivity(activityCode);
    setOccupation(null);
    setMappingError(false);
  };

  const handleSearch = async () => {
    const body = activity
      ? { activityCode: activity }
      : occupation
        ? { occupationCode: occupation }
        : null;

    if (!body) return;

    try {
      setLoading(true);
      setSummary(null);

      const res = await fetch('http://localhost:3000/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.salaryData?.length) {
        const aiRes = await fetch('http://localhost:3000/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: JSON.stringify(data.salaryData) }),
        });

        const ai = await aiRes.json();
        setSummary(ai.summary || null);
      }
    } catch (err) {
      console.error('Palgaandmete või kokkuvõtte laadimine ebaõnnestus', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContainer spacing={4} justifyContent="center" alignItems="center">
      <Typography variant="h4" component="h1" gutterBottom>
        Palgaotsing
      </Typography>
      <Typography variant="body1" textAlign="center" maxWidth="md">
        Tööriist, mis aitab leida infot valdkonna või ameti palga kohta.
      </Typography>

      <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={4} width="100%" maxWidth="1200px">
        <Card>
          <Stack spacing={3} alignItems="center">
            <OccupationDropdown value={occupation} onChange={handleOccupationChange} />
            <ActivityDropdown value={activity} onChange={handleActivityChange} />
            <Button variant="contained" onClick={handleSearch} disabled={!activity && !occupation}>
              Otsi palgaandmed
            </Button>
            {mappingError && (
              <Typography color="error">
                Valitud ameti kohta ei leitud sobivat tegevusala.
              </Typography>
            )}
          </Stack>
        </Card>

        {(loading || summary) && (
          <Card>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : (
              summary && <FormattedAiResponse summary={summary} />
            )}
          </Card>
        )}
      </Stack>
    </LayoutContainer>
  );
}

export default App;