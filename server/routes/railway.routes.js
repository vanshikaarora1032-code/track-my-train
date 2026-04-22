import express from 'express';
import https from 'https';
import dotenv from 'dotenv';
import { 
  checkPNRStatus, 
  getTrainInfo, 
  trackTrain, 
  getAvailability, 
  searchTrainBetweenStations,
  configure
} from 'irctc-connect';

dotenv.config();

const router = express.Router();

// Configure SDK
configure(process.env.IRCTC_API_KEY);

// Helper for RapidAPI
const fetchFromRapidAPI = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: process.env.RAPIDAPI_HOST,
      port: null,
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
        const body = Buffer.concat(chunks);
        try {
          const json = JSON.parse(body.toString());
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON response from API'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
};

// Train Info / Search
router.post('/train-info', async (req, res) => {
  try {
    const { trainNo } = req.body;
    const response = await getTrainInfo(trainNo);
    if (response.success) {
      res.json({ status: true, data: response.data });
    } else {
      res.json({ status: false, message: response.message || 'Train not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// PNR Status
router.post('/pnr-status', async (req, res) => {
  try {
    const { pnr } = req.body;
    console.log(`Checking PNR Status for: ${pnr} via RapidAPI`);
    
    // Using the path format provided by the user: /name/:pnr
    const response = await fetchFromRapidAPI(`/name/${pnr}`);
    
    if (response && !response.errorMsg && response.pnrNo) {
      // Ensure the data structure matches what the frontend expects
      // The frontend expects: { pnrNumber, chartStatus, passengers: [{ no, bookingStatus, currentStatus }] }
      const mappedData = {
        pnrNumber: response.pnrNo,
        chartStatus: response.chartStts || 'NOT PREPARED',
        passengers: (response.passengerDetailsDTO || []).map((p) => ({
          no: p.serialNo,
          bookingStatus: p.seatStts, // RapidAPI seems to use seatStts for current/booking status
          currentStatus: p.seatStts
        }))
      };
      res.json({ status: true, data: mappedData });
    } else {
      res.json({ status: false, message: response.errorMsg || 'PNR not found or Invalid PNR' });
    }
  } catch (error) {
    console.error('RapidAPI PNR Error:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch PNR status' });
  }
});

// Live Track (Used for Live Status)
router.post('/track', async (req, res) => {
  try {
    const { trainNo, date } = req.body;
    const response = await trackTrain(trainNo, date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    if (response.success) {
      res.json({ status: true, data: response.data });
    } else {
      res.json({ status: false, message: response.message || 'Status not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Seat Availability
router.post('/availability', async (req, res) => {
  try {
    const { trainNo, src, dst, date, classType, quota } = req.body;
    const response = await getAvailability(trainNo, src, dst, date, classType, quota);
    if (response.success) {
      res.json({ status: true, data: response.data });
    } else {
      res.json({ status: false, message: response.message || 'Not available' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Trains Between Stations
router.post('/between-stations', async (req, res) => {
  try {
    console.log('Received request for between-stations:', req.body);
    const { src, dst, date } = req.body;
    const response = await searchTrainBetweenStations(src, dst, date);
    console.log('SDK Response for between-stations:', response);
    if (response.success) {
      res.json({ status: true, data: response.data });
    } else {
      res.json({ status: false, message: response.message || 'Trains not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

export default router;
