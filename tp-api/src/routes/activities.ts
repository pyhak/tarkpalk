import express from 'express';
import { getActivityOptions } from '../services/activitiesService';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q as string)?.toLowerCase() ?? '';
    const options = await getActivityOptions();

    const results = options.filter((opt) =>
      opt.name.toLowerCase().includes(query) || opt.code.toLowerCase().includes(query)
    );

    res.json(results);
  } catch (error) {
    console.error('Tegevusala otsing ebaõnnestus:', error);
    res.status(500).json({ error: 'Tegevusalade laadimine ebaõnnestus' });
  }
});

export default router;
