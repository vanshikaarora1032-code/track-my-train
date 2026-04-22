import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

// Main Search Route
app.post('/api/railway/between-stations', async (req, res) => {
  const { src, dst } = req.body;
  // Always return fallback for now to ensure NO 500 crashes
  console.log('Search:', src, dst);
  res.json({ 
    status: true, 
    data: getDynamicFallbackTrains(src, dst),
    isFallback: true
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
