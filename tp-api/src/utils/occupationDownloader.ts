import axios from 'axios';
import fs from 'fs';
import path from 'path';

const CACHE_PATH = path.join(__dirname, '../../data/occupations.json');

export async function downloadOccupations(): Promise<void> {
  const url = 'https://klassifikaatorid.stat.ee/item/stat.ee/b8fdb2b9-8269-41ca-b29e-5454df555147/57/output/classification-version-summary-json';

  try {
    const response = await axios.get(url);

    fs.writeFileSync(CACHE_PATH, JSON.stringify(response.data, null, 2));
    console.log('[Occupations] Andmed salvestatud toorvormis (parsimata)');
  } catch (error) {
    console.error('[Occupations] Allalaadimine ebaõnnestus:', error);
    throw error;
  }
}
