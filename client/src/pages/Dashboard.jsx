import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, MapPin, Ticket, User, 
  ChevronRight, Navigation, Clock, 
  Train, ArrowUpDown, Menu, Mic, 
  X, History, LayoutGrid, Map
} from 'lucide-react';
import { railwayApi } from '../services/railwayApi';

const Dashboard = () => {
  const navigate = useNavigate();
  // We use SPOT, PNR, TICKETS to match 'Where is my train'
  const [activeTab, setActiveTab] = useState('SPOT');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [trainQuery, setTrainQuery] = useState('');
  const [history] = useState([
    { id: 1, train: '12992 Udaipur City Intercity', route: 'JP - BJNR' },
    { id: 2, train: '19666 Khajuraho Express', route: 'BJNR - JP' },
    { id: 3, train: '12991 Jaipur Intercity', route: 'BJNR - JP' },
  ]);

  // PNR Data State
  const [pnr, setPnr] = useState('');
  const [loadingPnr, setLoadingPnr] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [pnrError, setPnrError] = useState('');

  // Fallback demo data for PNR so UI can always be previewed
  const demoPnrData = {
    pnrNumber: "2134567890",
    chartStatus: "NOT PREPARED",
    isMockData: true, // Flag to show it's fake data
    passengers: [
      { no: 1, bookingStatus: "CNF/S4/21", currentStatus: "CNF" },
      { no: 2, bookingStatus: "CNF/S4/22", currentStatus: "CNF" },
      { no: 3, bookingStatus: "WL/15", currentStatus: "RAC/12" }
    ]
  };

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handlePnrSearch = async (e) => {
    if (e) e.preventDefault();
    if (!pnr || pnr.length !== 10) {
      setPnrError('Please enter a valid 10-digit PNR number');
      return;
    }
    
    setLoadingPnr(true);
    setPnrError('');
    setPnrData(null);

    try {
      const response = await railwayApi.getPnrStatus(pnr);
      if (response && response.status && response.data) {
        const raw = response.data;
        setPnrData({
          pnrNumber: raw.pnr || raw.pnrNumber,
          chartStatus: raw.chartStatus || raw.chart_status || 'NOT PREPARED',
          passengers: (raw.passengers || []).map(p => ({
            no: p.passengerSerialNo || p.no || p.serialNumber,
            bookingStatus: p.bookingStatus || p.booking_status,
            currentStatus: p.currentStatus || p.current_status
          }))
        });
      } else {
        // Fall back to demo data so the app doesn't break
        console.warn("PNR Status Failed (likely old/flushed), using Demo Data");
        setPnrError(''); // Clear error since we are showing mock data
        setPnrData(demoPnrData);
      }
    } catch (err) {
      console.warn("API Connection Error, using Demo Data");
      setPnrError('');
      setPnrData(demoPnrData);
    } finally {
      setLoadingPnr(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-white pb-20">
      
      {/* Custom App Bar Header (Matches reference) */}
      <div className="bg-bg-card border-b border-border-custom p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="text-white" size={24} />
          <h1 className="text-lg font-semibold tracking-wide">Track the Train</h1>
        </div>
        <Mic className="text-white" size={24} />
      </div>

      {/* Mode Select Tabs */}
      <div className="bg-bg-card px-4 pb-4 flex gap-2 border-b border-border-custom shadow-lg">
        {['SPOT', 'PNR'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${
              activeTab === tab 
              ? 'bg-accent text-bg-primary shadow-[0_0_15px_rgba(200,241,53,0.3)]' 
              : 'bg-white/5 text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        
        <AnimatePresence mode="wait">
          {activeTab === 'SPOT' && (
            <motion.div
              key="spot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
        
        {/* Route Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border-custom rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="relative space-y-4">
            {/* Dotted Line Connector */}
            <div className="absolute left-[9.5px] top-4 bottom-[75px] w-0.5 border-l-2 border-dotted border-text-muted/30 pointer-events-none"></div>

            {/* From Station */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full border-2 border-text-muted/50 bg-bg-card flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50"></div>
              </div>
              <div className="flex-1 border-b border-border-custom pb-2">
                <div className="flex items-center justify-between">
                  <input 
                    type="text"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    placeholder="From Station"
                    className="w-full bg-transparent outline-none text-white font-medium placeholder:text-text-muted"
                  />
                  <X size={16} className="text-text-muted cursor-pointer" onClick={() => setFromStation('')} />
                </div>
              </div>
            </div>

            {/* Swap Button (Absolute) */}
            <button 
              onClick={handleSwap}
              className="absolute right-2 top-[30px] z-20 w-9 h-9 bg-bg-card border border-border-custom rounded-full flex items-center justify-center text-accent shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <ArrowUpDown size={16} />
            </button>

            {/* To Station */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-5 h-5 rounded-full border-2 border-text-muted/50 bg-bg-card flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-text-muted/50"></div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <input 
                    type="text"
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    placeholder="To Station"
                    className="w-full bg-transparent outline-none text-white font-medium placeholder:text-text-muted"
                  />
                  <X size={16} className="text-text-muted cursor-pointer" onClick={() => setToStation('')} />
                </div>
              </div>
            </div>

            {/* Find Trains Button */}
            <button 
              onClick={() => {
                // The API needs station codes (e.g. 'JP'), but users might type 'Jaipur (JP)'
                // Simple extraction: assume code is the word if short, or look for uppercase words
                const getCode = (str) => {
                  if (!str) return '';
                  const parts = str.split(' ');
                  // Try to find a part that is all uppercase
                  const code = parts.find(p => p === p.toUpperCase() && p.length > 1 && !/\d/.test(p));
                  return code || str.trim(); 
                }
                
                const fromCode = getCode(fromStation);
                const toCode = getCode(toStation);
                
                if (!fromCode || !toCode) return;
                navigate('/train-list', { state: { from: fromCode, to: toCode } })
              }}
              className="w-full bg-accent text-bg-primary py-4 rounded-xl flex items-center justify-center font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(200,241,53,0.2)]"
            >
              Find trains
            </button>
          </div>
        </motion.div>

        {/* Train No. / Train Name Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card border border-border-custom rounded-xl p-4 flex items-center gap-4"
        >
          <div className="p-3 bg-white/5 rounded-xl border border-border-custom">
            <Train size={28} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Train No. / Name</p>
                <input 
                  type="text"
                  placeholder="Enter Train Number"
                  value={trainQuery}
                  onChange={(e) => setTrainQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-white font-bold text-lg placeholder:text-white/10"
                />
              </div>
              <button 
                onClick={() => trainQuery && navigate('/live-status', { state: { trainNo: trainQuery } })}
                className="p-3.5 bg-accent rounded-xl text-bg-primary font-bold shadow-[0_0_10px_rgba(200,241,53,0.2)]"
              >
                <Search size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>

            </motion.div>
          )}

          {activeTab === 'PNR' && (
            <motion.div
              key="pnr"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-bg-card border border-border-custom rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Ticket className="text-accent" size={20} />
                  Check PNR Status
                </h2>

                <form onSubmit={handlePnrSearch} className="mb-6 relative">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={pnr}
                      maxLength={10}
                      onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))} // only digits
                      placeholder="Enter 10-digit PNR" 
                      className="w-full bg-bg-input border border-border-custom rounded-xl py-4 pl-4 pr-16 text-white placeholder-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(200,241,53,0.15)] transition-all font-bold tracking-widest"
                    />
                    <button 
                      type="submit" 
                      disabled={loadingPnr}
                      className="absolute right-2 bg-accent text-bg-primary p-3 rounded-lg shadow-[0_0_10px_rgba(200,241,53,0.3)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loadingPnr ? (
                        <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search size={20} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </form>

                {pnrError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                    {pnrError}
                  </div>
                )}

                {pnrData && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 border-t border-border-custom pt-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block mb-1">PNR Number {pnrData.isMockData && <span className="text-yellow-500 bg-yellow-500/10 px-1 py-0.5 rounded ml-2">DEMO PREVIEW</span>}</span>
                        <p className="text-white font-black text-xl tracking-widest">{pnrData.pnrNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1.5 bg-accent/20 border border-accent rounded-lg text-[10px] font-bold text-accent uppercase tracking-widest shadow-[0_0_10px_rgba(200,241,53,0.1)]">
                          {pnrData.chartStatus}
                        </span>
                      </div>
                    </div>

                    <div className="bg-bg-input rounded-xl border border-border-custom overflow-hidden">
                      <div className="bg-white/5 py-2 px-4 border-b border-border-custom flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                          <User size={14} className="text-accent" />
                          Passenger Info
                        </h3>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Current Status</span>
                      </div>
                      
                      <div className="divide-y divide-border-custom">
                        {pnrData.passengers.map((p, idx) => (
                          <div key={idx} className="p-4 flex justify-between items-center group hover:bg-white/5 transition-colors">
                            <div>
                              <span className="text-white font-bold text-sm block mb-1">Pass {p.no}</span>
                              <span className="text-text-muted text-xs font-medium">BKG: {p.bookingStatus}</span>
                            </div>
                            <div className="text-right">
                              <span className={`font-black text-lg ${p.currentStatus.includes('CNF') ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-accent drop-shadow-[0_0_8px_rgba(200,241,53,0.3)]'}`}>
                                {p.currentStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
