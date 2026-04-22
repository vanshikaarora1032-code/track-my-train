import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Train, Clock, MapPin, ChevronRight, Filter } from 'lucide-react';
import { railwayApi } from '../services/railwayApi';

const TrainList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};
  const { from, to, date } = searchParams;

  const [loading, setLoading] = useState(true);
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrains = async () => {
      if (!from || !to) {
        setError('Please enter both From and To stations');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await railwayApi.getTrainsBetweenStations(from, to, date);
        if (response.status && response.data) {
          setTrains(response.data);
        } else {
          setError(response.message || 'No trains found for this route');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch trains. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [from, to, date]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-white pb-20">
      {/* Header */}
      <div className="bg-bg-card border-b border-border-custom p-4 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate uppercase tracking-wider text-accent">
            {from} → {to}
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5">{date || 'Today'}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-bg-card border border-border-custom rounded-2xl p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-border-custom rounded w-1/2"></div>
                  <div className="h-5 bg-border-custom rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-border-custom rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-border-custom rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-bg-input border border-border-custom rounded-xl text-sm font-bold text-white hover:border-accent transition-all"
            >
              Try Another Route
            </button>
          </div>
        )}

        {/* Train List */}
        {!loading && !error && trains.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{trains.length} Trains Found</span>
              <button className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                <Filter size={12} /> Filter
              </button>
            </div>
            
            {trains.map((train, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-bg-card border border-border-custom rounded-2xl p-4 shadow-lg group hover:border-accent/30 transition-all"
                onClick={() => navigate('/live-status', { state: { trainNo: train.trainNo } })}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors leading-tight">
                      {train.trainNo} • {train.trainName}
                    </h3>
                    <p className="text-[10px] text-text-muted mt-1.5 font-bold tracking-widest uppercase">Runs: MTWTFSS</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20">
                      {train.travelTime || '12h 30m'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 bg-bg-input/30 p-3 rounded-xl border border-border-custom/50">
                  <div className="text-center flex-1">
                    <p className="text-sm font-bold text-white">{train.fromStationTime || '10:30'}</p>
                    <p className="text-[10px] text-text-muted mt-0.5 truncate uppercase">{train.fromStationCode || from}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-30 flex-1">
                    <div className="w-full h-[1px] bg-text-muted"></div>
                    <Train size={12} className="rotate-90" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm font-bold text-white">{train.toStationTime || '22:00'}</p>
                    <p className="text-[10px] text-text-muted mt-0.5 truncate uppercase">{train.toStationCode || to}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-4 overflow-x-auto hide-scrollbar pb-1 snap-x">
                  {['SL', '3A', '2A', '1A'].map(cls => (
                    <div key={cls} className="bg-bg-input border border-border-custom px-4 py-2 rounded-xl shrink-0 snap-start min-w-[80px]">
                      <p className="text-[10px] font-black text-white mb-0.5 uppercase">{cls}</p>
                      <p className="text-[9px] text-green-400 font-bold tracking-tighter">AVAILABLE</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainList;
