import express from 'express';
import { loadIscoData, getAllIscoItems } from '../utils/iscoLoader';

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

export default router;
