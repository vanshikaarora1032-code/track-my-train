import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CalendarClock, ArrowLeft, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { railwayApi } from '../services/railwayApi';

const TrainSchedule = () => {
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
      const response = await railwayApi.getTrainSchedule(trainNo);
      if (response && response.status && response.data) {
        // SDK returns { trainInfo: {...}, route: [...] }
        const route = response.data.route || [];
        const mappedData = route.map(stop => ({
          station: stop.stnName || stop.stationName || stop.station,
          arr: stop.arrival || stop.arr,
          dep: stop.departure || stop.dep,
          day: stop.day
        }));
        setData(mappedData);
      } else {
        setError(response.message || 'Error fetching Schedule data. Try again.');
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
        <h1 className="text-xl font-bold text-white">Train Schedule</h1>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
            placeholder="Enter Train Number" 
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
          <div className="h-4 bg-border-custom rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                 <div className="w-2 h-16 bg-border-custom rounded"></div>
                 <div className="h-10 bg-border-custom rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Data Timeline */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card border border-border-custom shadow-lg rounded-2xl p-6 relative"
          >
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
               <List size={18} className="text-accent" /> Routing for {trainNo}
            </h3>

            <div className="relative border-l-2 border-border-custom ml-3 pl-6 space-y-6">
              {data.map((stop, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-bg-card ${idx === 0 || idx === data.length - 1 ? 'bg-accent' : 'bg-border-custom'}`}></div>
                  
                  <h4 className="text-white font-semibold text-sm mb-1">{stop.station}</h4>
                  <div className="flex gap-4 text-xs text-text-muted">
                    <span>Arr: <span className="text-gray-300">{stop.arr}</span></span>
                    <span>Dep: <span className="text-gray-300">{stop.dep}</span></span>
                    <span>Day {stop.day}</span>
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

export default TrainSchedule;
