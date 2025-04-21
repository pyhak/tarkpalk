import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import { downloadOccupations } from './utils/occupationDownloader';
import { generateSummary } from "./services/openaiService";
import { loadIscoData, getAllIscoItems } from './utils/iscoLoader';
import { getActivityOptions, fetchSalaryDataByGroupCode } from './services/activitiesService';
import { findGroupCodeFor } from './utils/iscoLoader';
import { mapOccupationToActivity } from './utils/occupationToActivityMapper';
import { asyncHandler } from './utils/asyncHandler';

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


  app.get('/activities/search', async (req, res) => {
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

  app.get('/activity-from-occupation/:code', asyncHandler(async (req: Request, res: Response) => {
    const occupationCode = req.params.code;
    const activity = mapOccupationToActivity(occupationCode);
  
    if (!activity) {
      res.status(404).json({ error: 'Tegevusala ei leitud antud ametikoodile' });
      return;
    }
  
    res.json({ activityCode: activity });
  }));

  app.post('/salary', asyncHandler(async (req: Request, res: Response) => {
    const { occupationCode, activityCode } = req.body;
  
    let groupCode: string | null = null;
  
    if (occupationCode) {
      await loadIscoData();
      const iscoGroup = findGroupCodeFor(occupationCode);
      if (!iscoGroup) {
        res.status(400).json({ error: 'Sobivat ISCO ametirühma ei leitud' });
        return;
      }
      groupCode = mapOccupationToActivity(iscoGroup) ?? null;
    }
  
    if (!groupCode && activityCode) {
      groupCode = activityCode;
    }
  
    if (!groupCode) {
      res.status(400).json({ error: 'Puudub kehtiv groupCode' });
      return;
    }
  
    const salaryData = await fetchSalaryDataByGroupCode(groupCode);
    res.json({ groupCode, salaryData });
  }));

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