import express from 'express';
import cors from 'cors';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Dynamic Import for IRCTC SDK to prevent startup crash on Vercel
let sdk = null;
const loadSdk = async () => {
  if (sdk) return sdk;
  try {
    const module = await import('irctc-connect');
    sdk = module;
    if (process.env.IRCTC_API_KEY) {
      sdk.configure(process.env.IRCTC_API_KEY);
      console.log('SDK configured successfully');
    }
    return sdk;
  } catch (e) {
    console.error('Failed to load IRCTC SDK:', e.message);
    return null;
  }
};

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Trains Between Stations
app.post('/api/railway/between-stations', async (req, res) => {
  try {
    const { src, dst, date } = req.body;
    console.log('Search Request:', { src, dst, date });

    let response = { success: false };
    
    const irctc = await loadSdk();
    if (irctc && process.env.IRCTC_API_KEY && src && dst) {
      try {
        response = await irctc.searchTrainBetweenStations(src, dst, date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
      } catch (e) {
        console.error('SDK Search Error:', e.message);
      }
    }

    if (response && response.success && response.data && response.data.length > 0) {
      res.json({ status: true, data: response.data });
    } else {
      console.log('Returning dynamic fallback');
      res.json({ 
        status: true, 
        data: getDynamicFallbackTrains(src, dst),
        isFallback: true,
        message: 'Viewing preview data'
      });
    }
  } catch (error) {
    console.error('Global Route Error:', error);
    res.json({ 
      status: true, 
      data: getDynamicFallbackTrains(req.body.src, req.body.dst),
      isFallback: true,
      error: error.message 
    });
  }
});

// PNR Status
app.post('/api/railway/pnr-status', async (req, res) => {
  try {
    const { pnr } = req.body;
    const response = await fetchFromRapidAPI(`/name/${pnr}`);
    
    if (response && !response.errorMsg && response.pnrNo) {
      const mappedData = {
        pnrNumber: response.pnrNo,
        chartStatus: response.chartStts || 'NOT PREPARED',
        passengers: (response.passengerDetailsDTO || []).map((p) => ({
          no: p.serialNo,
          bookingStatus: p.seatStts,
          currentStatus: p.seatStts
        }))
      };
      res.json({ status: true, data: mappedData });
    } else {
      res.json({ status: false, message: response.errorMsg || 'PNR not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to fetch PNR status' });
  }
});

// Helper for RapidAPI
function fetchFromRapidAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: process.env.RAPIDAPI_HOST,
      path: path,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getDynamicFallbackTrains(src, dst) {
  const majorCities = { 'NDLS': 'New Delhi', 'BJNR': 'Bijainagar', 'AII': 'Ajmer', 'JU': 'Jodhpur', 'JP': 'Jaipur' };
  const s = src?.toUpperCase();
  const d = dst?.toUpperCase();
  const srcName = majorCities[s] || src || 'Source';
  const dstName = majorCities[d] || dst || 'Destination';
  return [
    {
      trainNo: '12992', trainName: `${srcName}-${dstName} Express`,
      fromStationCode: s, toStationCode: d,
      fromStationTime: '06:15', toStationTime: '13:45',
      travelTime: '7h 30m', classes: ['SL', '3A', '2A']
    },
    {
      trainNo: '19666', trainName: `${dstName} Intercity`,
      fromStationCode: s, toStationCode: d,
      fromStationTime: '14:30', toStationTime: '19:15',
      travelTime: '4h 45m', classes: ['2S', 'CC']
    }
  ];
}

export default app;
