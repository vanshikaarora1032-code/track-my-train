import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Ticket, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { railwayApi } from '../services/railwayApi';

const PnrStatus = () => {
  const [pnr, setPnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnr || pnr.length !== 10) {
      setError('Please enter a valid 10-digit PNR number');
      return;
    }
    
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await railwayApi.getPnrStatus(pnr);
      if (response && response.status && response.data) {
        const raw = response.data;
        const mappedData = {
          pnrNumber: raw.pnr || raw.pnrNumber,
          chartStatus: raw.chartStatus || raw.chart_status || 'NOT PREPARED',
          passengers: (raw.passengers || []).map(p => ({
            no: p.passengerSerialNo || p.no || p.serialNumber,
            bookingStatus: p.bookingStatus || p.booking_status,
            currentStatus: p.currentStatus || p.current_status
          }))
        };
        setData(mappedData);
      } else {
        setError(response.message || 'Error fetching PNR data. Try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection failed. Please check your network or API Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 pb-6 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 bg-bg-card rounded-xl border border-border-custom hover:border-accent transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Check PNR Status</h1>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={pnr}
            maxLength={10}
            onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))} // only digits
            placeholder="Enter 10-digit PNR" 
            className="w-full bg-bg-card border border-border-custom rounded-2xl py-4 pl-5 pr-16 text-white placeholder-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(200,241,53,0.15)] transition-all"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 bg-accent text-bg-primary p-3 rounded-xl shadow-[0_0_10px_rgba(200,241,53,0.3)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-bg-card border border-border-custom rounded-2xl p-5 animate-pulse">
          <div className="h-6 bg-border-custom rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-border-custom rounded w-1/2 mb-6"></div>
          
          <div className="space-y-3 mt-4">
            <div className="h-16 bg-border-custom rounded w-full"></div>
            <div className="h-16 bg-border-custom rounded w-full"></div>
          </div>
        </div>
      )}

      {/* Real Data Result Card */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card border border-border-custom shadow-lg rounded-2xl p-5 relative overflow-hidden"
          >
            
            <div className="flex justify-between items-center mb-6 border-b border-border-custom pb-4">
              <div>
                <span className="text-text-muted text-xs block mb-1">PNR Number</span>
                <p className="text-white font-bold text-lg">{data.pnrNumber}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-accent/10 border border-accent rounded-lg text-xs font-semibold text-accent">
                  {data.chartStatus}
                </span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={16} className="text-accent" />
              Passenger Details
            </h3>

            <div className="space-y-3">
              {data.passengers.map((p, idx) => (
                <div key={idx} className="bg-bg-input p-4 rounded-xl border border-border-custom flex justify-between items-center group hover:border-accent/30 transition-colors">
                  <div>
                    <span className="text-text-muted text-xs block">Passenger {p.no}</span>
                    <span className="text-white font-medium text-sm">Booking: {p.bookingStatus}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted text-xs block mb-1">Current Status</span>
                    <span className={`font-bold ${p.currentStatus.includes('CNF') ? 'text-green-400' : 'text-yellow-400'}`}>
                      {p.currentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PnrStatus;
