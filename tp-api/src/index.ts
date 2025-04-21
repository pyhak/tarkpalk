import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import fs from 'fs';
import path from "path";

import occupationsRouter from './routes/occupations';
import activitiesRouter from './routes/activities';
import summaryRouter from './routes/summary';
import salaryRouter from './routes/salary';

import { downloadOccupations } from './utils/occupationDownloader';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/occupations', occupationsRouter);
app.use('/activities', activitiesRouter);
app.use('/api/summary', summaryRouter);
app.use('/salary', salaryRouter);

app.listen(PORT, async () => {
  console.log(`Server töötab pordil ${PORT}`);

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