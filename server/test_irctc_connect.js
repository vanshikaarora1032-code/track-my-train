import { configure, searchTrainBetweenStations } from 'irctc-connect';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

configure(process.env.IRCTC_API_KEY);

const testSearch = async (from, to) => {
  try {
    console.log(`Searching trains between ${from} and ${to}...`);
    const res = await searchTrainBetweenStations(from, to);
    console.log('Result:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
};

testSearch('NDLS', 'JP');
