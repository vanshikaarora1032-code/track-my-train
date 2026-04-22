import https from 'https';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testSearch = (from, to) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'real-time-pnr-status-api-for-indian-railways.p.rapidapi.com',
      port: null,
      path: `/betweenStations/${from}/${to}`, // Trying a guess
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'real-time-pnr-status-api-for-indian-railways.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log('Path:', options.path);
        console.log('Status Code:', res.statusCode);
        console.log('Body:', body.toString());
        resolve(res.statusCode);
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
};

testSearch('NDLS', 'BCT');
// Also try another path
testSearch('NDLS', 'JP');
