import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as Armchair, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { railwayApi } from '../services/railwayApi';

const SeatAvailability = () => {
  const [trainNo, setTrainNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trainNo) return;
    
    setLoading(true);
    setError('');
    setData(null);

    try {
      // For demo, passing dummies for src, dst, date etc.
      const response = await railwayApi.getSeatAvailability(trainNo, 'NDLS', 'BCT', '2024-04-17', '3A', 'GN');
      if (response && response.status && response.data) {
        const raw = response.data;
        const fare = raw.fare?.totalFare || 0;
        const mappedData = (raw.availability || []).map(item => ({
          date: item.date,
          availability: item.availabilityText || item.status,
          fare: fare,
          confirmProb: item.prediction || 'Unknown'
        }));
        setData(mappedData);
      } else {
        setError(response.message || 'Error fetching Seat data. Try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your network or API Key.');
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
        <h1 className="text-xl font-bold text-white">Seat Availability</h1>
      </div>

      {/* Search Input Filter Form */}
      <form onSubmit={handleSearch} className="mb-8 space-y-3 relative">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
            placeholder="Train Number" 
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
        {/* Optional mock filters purely visual for aesthetic consistency */}
        <div className="grid grid-cols-2 gap-3 hidden md:grid">
          <input type="text" placeholder="Source (NDLS)" className="bg-bg-input border border-border-custom rounded-xl p-3 text-sm text-white" disabled/>
          <input type="date" className="bg-bg-input border border-border-custom rounded-xl p-3 text-sm text-white opacity-50" disabled/>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
             <div key={i} className="bg-bg-card border border-border-custom rounded-2xl p-5 animate-pulse h-32">
             </div>
          ))}
        </div>
      )}

      {/* Real Data Rendering */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {data.map((item, idx) => {
              const isAvailable = item.availability.includes('AVAILABLE') || item.availability.includes('RAC');
              return (
                <div key={idx} className="bg-bg-card border border-border-custom rounded-2xl p-4 hover:border-accent/30 transition-colors group relative overflow-hidden">
                   {isAvailable && (
                     <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20"></div>
                   )}
                   <span className="text-sm font-semibold text-white block mb-2">{item.date}</span>
                   <div className="flex justify-between items-end">
                      <span className={`text-lg font-bold ${isAvailable ? 'text-green-400' : 'text-yellow-500'}`}>
                        {item.availability}
                      </span>
                      <span className="text-text-muted text-xs">₹ {item.fare}</span>
                   </div>
                   <div className="mt-3 pt-3 border-t border-border-custom flex justify-between items-center">
                     <span className="text-xs text-text-muted">Confirm Prob:</span>
                     <span className="text-xs font-semibold text-accent">{item.confirmProb}</span>
                   </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SeatAvailability;
