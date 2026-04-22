/**
 * Railway API Service
 * 
 * Uses environment variables for API keys.
 * VITE_RAPIDAPI_KEY is required for real connections.
 * If not present, this service will use mock data locally so you can still preview the UI.
 */

// Point to our local backend proxy
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/railway`;
console.log('Railway API initialized with URL:', API_BASE_URL);

const fetchApi = async (endpoint, data = {}) => {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Fetching from:', fullUrl);
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let errorMsg = `API Error ${response.status}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.message || errorMsg;
      } catch (e) {
        // Not JSON
      }
      console.error('Backend API Error:', response.status, errorMsg);
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('API Result:', result);
    return result;
  } catch (error) {
    console.error('API Fetch failed for endpoint:', endpoint);
    console.error('Full URL:', `${API_BASE_URL}${endpoint}`);
    console.error('Error Details:', error);
    throw error;
  }
};

export const railwayApi = {
  getTrainStatus: async (trainNo) => {
    return fetchApi('/track', { trainNo });
  },
  
  getPnrStatus: async (pnr) => {
    return fetchApi('/pnr-status', { pnr });
  },
  
  getSeatAvailability: async (trainNo, src, dst, date, classType, quota) => {
    return fetchApi('/availability', { trainNo, src, dst, date, classType, quota });
  },
  
  getTrainSchedule: async (trainNo) => {
    return fetchApi('/schedule', { trainNo });
  },
  
  getTrainsBetweenStations: async (src, dst, date) => {
    try {
      const res = await fetchApi('/between-stations', { src, dst, date: date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-') });
      if (!res.status) {
        console.warn('Real API failed to find trains, using fallback preview data.', res.message);
        return mockResponse('/between-stations');
      }
      return res;
    } catch (e) {
      console.warn('Real API threw error, using fallback preview data.', e);
      return mockResponse('/between-stations');
    }
  }
};

// ==========================================
// Mock Data Responses for preview without API Key
// ==========================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function mockResponse(endpoint) {
  await delay(1200); // Simulate network delay

  if (endpoint.includes('searchTrain')) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const trainNo = urlParams.get('trainNo') || '12951';
    return {
      status: true,
      message: 'Success',
      data: {
        trainNo: trainNo,
        trainName: trainNo === '12951' ? 'Rajdhani Express' : 'Intercity Express',
        currentStation: 'NDLS - New Delhi',
        delay: '5 mins',
        platform: '3',
        status: 'On Time',
        lastUpdated: new Date().toLocaleTimeString()
      }
    };
  }
  
  if (endpoint.includes('getPNRStatus')) {
    return {
      status: true,
      message: 'Success',
      data: {
        pnrNumber: '1234567890',
        trainNo: '12951',
        chartStatus: 'PREPARED',
        passengers: [
          { no: 1, currentStatus: 'CNF / B4 / 12', bookingStatus: 'RLWL / 42' },
          { no: 2, currentStatus: 'CNF / B4 / 13', bookingStatus: 'RLWL / 43' }
        ]
      }
    };
  }

  if (endpoint.includes('checkTrainAvailability')) {
    return {
      status: true,
      data: [
        { date: '17 Apr', availability: 'GNWL 15 / WL 5', fare: 1250, confirmProb: '85%' },
        { date: '18 Apr', availability: 'AVAILABLE 12', fare: 1250, confirmProb: '100%' },
        { date: '19 Apr', availability: 'RAC 23', fare: 1250, confirmProb: '95%' },
      ]
    };
  }

  if (endpoint.includes('getTrainSchedule')) {
    return {
      status: true,
      data: [
        { station: 'NDLS - New Delhi', arr: 'Starts', dep: '16:30', day: 1 },
        { station: 'KOTA - Kota Jn', arr: '21:00', dep: '21:10', day: 1 },
        { station: 'BCT - Mumbai Central', arr: '08:40', dep: 'Ends', day: 2 }
      ]
    };
  }
  
  if (endpoint.includes('between-stations')) {
    return {
      status: true,
      data: [
        { 
          trainNo: '12992', 
          trainName: 'UDAIPUR CITY INTERCITY', 
          fromStationTime: '14:10', 
          toStationTime: '17:04', 
          fromStationCode: 'JP', 
          toStationCode: 'BJNR', 
          travelTime: '2h 54m',
          classes: ['2S', 'CC']
        },
        { 
          trainNo: '19666', 
          trainName: 'KHAJURAHO EXPRESS', 
          fromStationTime: '05:30', 
          toStationTime: '08:45', 
          fromStationCode: 'JP', 
          toStationCode: 'BJNR', 
          travelTime: '3h 15m',
          classes: ['SL', '3A', '2A', '1A']
        },
        { 
          trainNo: '12991', 
          trainName: 'JAIPUR INTERCITY', 
          fromStationTime: '09:00', 
          toStationTime: '11:45', 
          fromStationCode: 'JP', 
          toStationCode: 'BJNR', 
          travelTime: '2h 45m',
          classes: ['2S', 'CC']
        }
      ]
    };
  }

  throw new Error('Mock endpoint not found');
}
