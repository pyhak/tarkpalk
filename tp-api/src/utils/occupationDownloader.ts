import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { CLASS_API_BASE } from '../config';

export async function downloadOccupations(): Promise<void> {
  const res = await axios.get(CLASS_API_BASE);
  const outputPath = path.join(__dirname, '../../data/occupations.json');
  await fs.writeFile(outputPath, JSON.stringify(res.data, null, 2), 'utf-8');
  console.log('Ametite klassifikaator salvestatud:', outputPath);
}
