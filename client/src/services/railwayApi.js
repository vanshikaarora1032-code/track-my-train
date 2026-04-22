/**
 * Railway API Service
 * 
 * Uses environment variables for API keys.
 * VITE_RAPIDAPI_KEY is required for real connections.
 * If not present, this service will use mock data locally so you can still preview the UI.
 */

// Point to our backend proxy - Use relative path in production, absolute in development
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = import.meta.env.PROD ? '/api/railway' : `${VITE_API_URL}/api/railway`;
console.log('Railway API initialized in', import.meta.env.PROD ? 'PROD' : 'DEV', 'mode. URL:', API_BASE_URL);

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
      // The backend now provides its own fallback, so we just return the result
      return res;
    } catch (e) {
      console.error('Real API threw error in getTrainsBetweenStations.', e);
      throw e;
    }
  }
};

// ==========================================
// Mock Data Responses for preview without API Key
// ==========================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function mockResponse(endpoint) {
  await new Promise(res => setTimeout(res, 800)); // Slight delay

  if (endpoint.includes('searchTrain')) {
    return {
      status: true,
      data: {
        trainNo: '12951',
        trainName: 'Rajdhani Express',
        currentStation: 'NDLS - New Delhi',
        status: 'On Time'
      }
    };
  }
  
  if (endpoint.includes('between-stations')) {
     return { status: false, message: 'Backend should handle fallback' };
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
     return { status: false, message: 'Source results from backend instead' };
  }

  throw new Error('Mock endpoint not found');
}
