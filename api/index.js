import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/railway/between-stations', (req, res) => {
  const { src, dst } = req.body;
  res.json({ 
    status: true, 
    data: getDynamicFallbackTrains(src, dst),
    isFallback: true
  });
});

app.get('/api/railway/pnr-status', (req, res) => {
  res.json({ status: false, message: 'PNR route is active but needs POST' });
});

function getDynamicFallbackTrains(src, dst) {
  const majorCities = { 'NDLS': 'New Delhi', 'BJNR': 'Bijainagar', 'AII': 'Ajmer', 'JU': 'Jodhpur', 'JP': 'Jaipur' };
  const s = src?.toUpperCase() || 'SRC';
  const d = dst?.toUpperCase() || 'DST';
  const srcName = majorCities[s] || s;
  const dstName = majorCities[d] || d;
  return [
    {
      trainNo: '12992', trainName: `${srcName}-${dstName} Express`,
      fromStationCode: s, toStationCode: d,
      fromStationTime: '06:15', toStationTime: '13:45',
      travelTime: '7h 30m', classes: ['SL', '3A', '2A']
    }
  ];
}

// Export for Vercel
export default app;
