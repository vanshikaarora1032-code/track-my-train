import https from 'https';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testSearch = (from, to, date) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'irctc1.p.rapidapi.com',
      port: null,
      path: `/api/v3/trainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'irctc1.p.rapidapi.com'
      }
    };

    console.log('Testing with options:', options);

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log('Body:', body.toString());
        try {
          const json = JSON.parse(body.toString());
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
};

testSearch('NDLS', 'BCT', '2024-04-23')
  .then(res => console.log('Result:', JSON.stringify(res, null, 2)))
  .catch(err => console.error('Error:', err));
