import express from 'express';
import { generateSummary } from '../services/openaiService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { data } = req.body;
    const summary = await generateSummary(data);
    res.json({ summary });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Midagi läks valesti.' });
  }
});

export default router;
