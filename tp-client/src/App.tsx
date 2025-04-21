import { useState } from 'react';
import {
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { OccupationDropdown } from './components/OccupationDropdown';
import { ActivityDropdown } from './components/ActivityDropdown';
import './App.css';
import { fetchActivityForOccupation, fetchSalaryData, fetchSummary } from './services/fetch';
import { SalaryRequest } from './classes/types';
import { Card, LayoutContainer, ResponsiveStack } from './styles';

function App() {
  const [occupation, setOccupation] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [mappingError, setMappingError] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOccupationChange = async (occupationCode: string | null) => {
    setOccupation(occupationCode);

    if (occupationCode) {
      try {
        const activityCode = await fetchActivityForOccupation(occupationCode);
        if (activityCode) {
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
    const body: SalaryRequest | null = activity
      ? { activityCode: activity }
      : occupation
        ? { occupationCode: occupation }
        : null;

    if (!body) return;

    try {
      setLoading(true);
      setSummary(null);

      const salaryData = await fetchSalaryData(body);
      if (salaryData?.length) {
        const aiSummary = await fetchSummary(salaryData);
        setSummary(aiSummary || null);
      }
    } catch (err) {
      console.error('Palgaandmete või kokkuvõtte laadimine ebaõnnestus', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContainer spacing={4} justifyContent="center" alignItems="center">
      <Box sx={{ mb: 3 }}>
    <img src="/logo.svg" alt="Palgaotsing" width={180} height="auto" />
  </Box>
      <Typography variant="body1" textAlign="center" maxWidth="md">
        Tööriist, mis aitab leida infot valdkonna või ameti palga kohta.
      </Typography>

      <ResponsiveStack>
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
              summary &&
              <Typography
                variant="body1" textAlign="left"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            )}
          </Card>
        )}
      </ResponsiveStack>
    </LayoutContainer>
  );
}

export default App;
