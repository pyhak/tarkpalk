import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import { downloadOccupations } from './utils/occupationDownloader';
import { generateSummary } from "./services/openaiService";
import { loadIscoData, getAllIscoItems } from './utils/iscoLoader';
import { getActivityOptions } from './services/activitiesService';
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/summary", async (req, res) => {
    try {
        const { data } = req.body;
        const summary = await generateSummary(data);
        res.json({ summary });
    } catch (error) {
        console.error("OpenAI error:", error);
        res.status(500).json({ error: "Midagi läks valesti." });
    }
});

const CACHE_PATH = path.join(__dirname, '../data/occupations.json');

app.get('/occupations', async (req, res) => {
    try {
        await loadIscoData(); // tagab, et andmed on laetud
        const all = getAllIscoItems();

        const simplified = all.map(({ code, name }) => ({ code, name }));
        res.json(simplified);
    } catch (error) {
        console.error('Occupations laadimise viga:', error);
        res.status(500).json({ error: 'Occupations ei ole saadaval' });
    }
});

app.get('/occupations/search', async (req, res) => {
    try {
      const query = (req.query.q as string)?.toLowerCase() ?? '';
      await loadIscoData();
  
      const matches = getAllIscoItems()
        .filter((item) =>
          ['4', '5'].includes(item.level) &&
          item.name.toLowerCase().includes(query)
        )
        .map((item) => ({
          code: item.code,
          name: item.display,
        }));
  
      res.json(matches);
    } catch (err) {
      console.error('Otsing ebaõnnestus:', err);
      res.status(500).json({ error: 'Otsing ebaõnnestus' });
    }
  });

  app.get('/activities/search', async (req, res) => {
    try {
      const query = (req.query.q as string)?.toLowerCase() ?? '';
  
      const options = await getActivityOptions();
      const results = options.filter((opt) =>
        opt.name.toLowerCase().includes(query)
      );
  
      res.json(results);
    } catch (error) {
      console.error('Tegevusala otsing ebaõnnestus:', error);
      res.status(500).json({ error: 'Tegevusalade laadimine ebaõnnestus' });
    }
  });

app.listen(PORT, async () => {
    console.log(`Server töötab pordil ${PORT}`);

    // Proovi alla laadida/uuendada occupations cache
    try {
        const cachePath = path.join(__dirname, '../data/occupations.json');
        if (!fs.existsSync(cachePath)) {
            console.log('[Occupations] Cache puudub. Laen alla...');
            await downloadOccupations();
        } else {
            console.log('[Occupations] Cache olemas. Ei laadi uuesti.');
            // Võimalik hiljem lisada aegumiskontroll
        }
    } catch (err) {
        console.error('[Occupations] Allalaadimine ebaõnnestus:', err);
    }
});