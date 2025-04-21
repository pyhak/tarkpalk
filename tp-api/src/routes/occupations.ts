import express from 'express';
import { loadIscoData, getAllIscoItems } from '../utils/iscoLoader';
import { mapOccupationToActivity } from '../utils/occupationToActivityMapper';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await loadIscoData();
    const all = getAllIscoItems();
    const simplified = all.map(({ code, name }) => ({ code, name }));
    res.json(simplified);
  } catch (error) {
    console.error('Occupations laadimise viga:', error);
    res.status(500).json({ error: 'Occupations ei ole saadaval' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q as string)?.toLowerCase() ?? '';
    await loadIscoData();

    const matches = getAllIscoItems()
      .filter(
        (item) =>
          ['4', '5'].includes(item.level) &&
          item.name.toLowerCase().includes(query)
      )
      .map((item) => ({
        code: item.code,
        name: item.name,
        category: item.category,
      }));

    res.json(matches);
  } catch (err) {
    console.error('Otsing ebaõnnestus:', err);
    res.status(500).json({ error: 'Otsing ebaõnnestus' });
  }
});

router.get('/activity-from-occupation/:code', (req, res) => {
  const occupationCode = req.params.code;
  const activityCode = mapOccupationToActivity(occupationCode);

  if (!activityCode) {
    res.status(404).json({ error: 'Tegevusala ei leitud antud ametikoodile' });
    return;
  }

  res.json({ activityCode });
});

export default router;
