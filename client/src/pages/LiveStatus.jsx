import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Clock, Share2, MoreVertical, Train as TrainIcon, MapPin, Edit3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { railwayApi } from '../services/railwayApi';


const formatTime = (timeStr) => {
  if (!timeStr || timeStr === '--' || timeStr === 'SRC' || timeStr === 'DSTN') {
    return timeStr === 'SRC' ? 'Start' : (timeStr === 'DSTN' ? 'End' : '---');
  }
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const mins = match[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${mins} ${ampm}`;
  }
  return timeStr;
};

const LiveStatus = () => {
  const location = useLocation();
  const [trainNo, setTrainNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Auto-search if trainNo is passed from Dashboard
  useEffect(() => {
    const passedTrainNo = location.state?.trainNo;
    if (passedTrainNo) {
      setTrainNo(passedTrainNo);
      performSearch(passedTrainNo);
    }
  }, [location.state]);

  const performSearch = async (number) => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const response = await railwayApi.getTrainStatus(number);
      if (response && response.status && response.data && response.data.stations?.length > 0) {
         setData(response.data);
      } else {
         setError(response.message || 'Live status not available for this train.');
      }
    } catch (err) {
       console.error('Fetch Error:', err);
       setError('Failed to fetch live status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trainNo) return;
    performSearch(trainNo);
  };

  // Default Search View
  if (!data && !loading) {
     return (
        <div className="pt-4 pb-24 min-h-screen px-4 max-w-lg mx-auto flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="p-2 bg-bg-card rounded-xl border border-border-custom hover:border-accent transition-colors">
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Live Train Status</h1>
          </div>
          <form onSubmit={handleSearch} className="mb-8 relative w-full">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
                placeholder="Enter Train (e.g. 12992)" 
                className="w-full bg-bg-card border border-border-custom rounded-2xl py-4 pl-5 pr-16 text-white placeholder-text-muted focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(200,241,53,0.15)] transition-all text-lg"
              />
              <button 
                type="submit" 
                className="absolute right-2 bg-accent text-bg-primary p-3 rounded-xl shadow-[0_0_10px_rgba(200,241,53,0.3)] hover:scale-105 active:scale-95 transition-transform"
              >
                <Search size={22} strokeWidth={2.5} />
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
     );
  }

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-bg-primary"><div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Find index properties for rendering the timeline states correctly
  const currentStationIndex = data.stations.findLastIndex(s => s.arrival.actual !== '--' && s.arrival.actual !== '');
  const activeStation = currentStationIndex >= 0 ? data.stations[currentStationIndex] : data.stations[0];

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans text-text-primary">
      
      {/* 
        Fully Responsive Container 
        - Occupies full width perfectly on all mobile sizes, avoiding strict max-widths that force overflow
      */}
      <div className="w-full max-w-4xl mx-auto md:my-8 md:rounded-[24px] bg-bg-card flex flex-col relative md:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] md:border border-border-custom pb-0 overflow-x-hidden">
        
        {/* Top App Bar : Full Width */}
        <div className="bg-bg-card p-3 md:p-4 flex items-center justify-between shadow-sm z-20 text-white shrink-0">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden flex-1 pr-4">
             <button onClick={() => setData(null)} className="cursor-pointer p-1.5 hover:bg-bg-input rounded-full transition-colors shrink-0">
                 <ArrowLeft size={22} className="text-white hover:text-accent" />
             </button>
             {/* Bulletproof fast text truncation for phone screens avoiding horizontal expansion */}
             <h1 className="text-[14px] md:text-lg font-medium tracking-wide truncate min-w-0 flex-1">
                 {data.trainNo} - {data.trainName}
             </h1>
          </div>
          <button className="p-1.5 hover:bg-bg-input rounded-full transition-colors shrink-0">
            <MoreVertical size={22} className="text-text-muted hover:text-white" />
          </button>
        </div>
        
        {/* Quick Tabs - Scrollable with properly hidden scrollbars */}
        <div className="bg-bg-card px-3 md:px-4 pb-3 pt-1 flex gap-2 md:gap-3 overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-border-custom shrink-0">
          <button className="bg-accent/10 border border-accent text-accent shadow-[0_0_10px_rgba(200,241,53,0.05)] px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-[13px] font-medium flex items-center gap-1 transition-all">
             Today ▼
          </button>
          <button className="bg-bg-input border border-border-custom text-text-muted px-3 md:px-4 py-1.5 rounded-full text-[13px] md:text-[15px] font-medium flex items-center gap-1 hover:border-accent hover:text-white transition-all">
             <Clock size={15} /> Alarm
          </button>
          <button className="bg-bg-input border border-border-custom text-text-muted px-3 md:px-4 py-1.5 rounded-full text-[13px] md:text-[15px] font-medium flex items-center gap-1 hover:border-accent hover:text-white transition-all">
             <TrainIcon size={15} /> Coach
          </button>
          <button className="bg-bg-input border border-border-custom text-text-muted px-3 md:px-4 py-1.5 rounded-full text-[13px] md:text-[15px] font-medium flex items-center gap-1 hover:border-accent hover:text-white transition-all">
             <Share2 size={15} /> Share
          </button>
        </div>

        {/* Arrival / Departure Responsive Subheader */}
        <div className="bg-bg-input px-2 md:px-6 py-2 flex justify-between items-center text-sm font-semibold text-text-muted z-10 sticky top-0 border-b border-border-custom shadow-sm shrink-0 uppercase tracking-widest text-[9px] md:text-[11px]">
            <span className="w-[50px] md:w-[90px] text-center md:text-right">Arr</span>
            <span className="flex-1 text-center truncate px-2">Day 1 - {data.date?.split('-').slice(0,2).join(' ')}</span>
            <span className="w-[50px] md:w-[90px] text-center md:text-left">Dep</span>
        </div>

        {/* Timeline Content - Responsive List. Additional bottom padding protects from global nav items */}
        <div className="flex-1 bg-bg-primary relative pb-20 md:pb-12">
            {data.stations.map((station, idx) => {
                const isPassed = idx <= currentStationIndex;
                const isCurrent = idx === currentStationIndex;

                const arrivalSched = formatTime(station.arrival.scheduled);
                const arrivalAct = formatTime(station.arrival.actual);
                const depSched = formatTime(station.departure.scheduled);
                const depAct = formatTime(station.departure.actual);

                return (
                    // Removing min-height to naturally let flex rules bound it natively.
                    <div key={idx} className="flex items-stretch w-full relative hover:bg-bg-card/40 transition-colors group border-b border-border-custom/50 group-last:border-b-0 hide-scrollbar overflow-x-hidden">
                        
                        {/* Left Column: Arrival */}
                        <div className="w-[50px] md:w-[130px] shrink-0 pr-2 md:pr-6 flex flex-col justify-start items-end pt-5 md:pt-6 z-10 relative">
                            {arrivalSched !== '---' && arrivalSched && (
                                <span className="text-[10px] md:text-[14px] text-white font-medium leading-none tracking-wide text-right">{arrivalSched}</span>
                            )}
                            {arrivalAct !== '--' && arrivalAct !== arrivalSched && arrivalAct && (
                                <span className="text-[10px] md:text-[14px] font-bold text-red-500 leading-tight mt-1 tracking-wide text-right">{arrivalAct}</span>
                            )}
                        </div>

                        {/* Center Column: Seamless Pipeline & Station Dot */}
                        <div className="w-[30px] md:w-[40px] flex flex-col items-center relative shrink-0">
                            
                            {/* Seamless Solid Path Line: Centered precisely over the wrapper using left-1/2 -xl-1/2 rule */}
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[3px] md:w-[5px] h-full ${isPassed ? 'bg-accent shadow-[0_0_15px_rgba(200,241,53,0.3)]' : 'bg-border-custom'} transition-colors duration-300 z-0`}></div>
                            
                            {/* Masking the top and bottom edge cleanly with the parent background */}
                            {idx === 0 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 md:w-10 h-6 bg-bg-primary z-10"></div>}
                            {idx === data.stations.length - 1 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 md:w-10 h-[calc(100%-1.8rem)] bg-bg-primary z-10"></div>}

                            {/* Center Status Dot placed synchronously with the text padding */}
                            <div className="relative mt-[21px] md:mt-[23px] flex items-center justify-center z-20">
                                {/* Base outer ring */}
                                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-[1.5px] md:border-2 ${isPassed ? 'bg-bg-primary border-accent' : 'bg-bg-primary border-text-muted'} relative z-20`}></div>
                                
                                {/* Inner solid indicator for completed path */}
                                {isPassed && <div className="absolute w-[5px] h-[5px] md:w-[8px] md:h-[8px] rounded-full bg-accent z-30"></div>}
                                
                                {/* Pulsing aura for current station */}
                                {isCurrent && (
                                    <div className="absolute w-6 h-6 md:w-10 md:h-10 rounded-full bg-accent/20 animate-pulse z-10 blur-[2px]"></div>
                                )}
                            </div>
                        </div>

                        {/* Station Name & Right Column: Departure */}
                        <div className="flex-1 flex flex-row items-center md:items-start justify-between pl-2 md:pl-6 pr-3 md:pr-8 pt-5 md:pt-6 pb-6 min-w-0">
                            
                            {/* Station Info Core : flex-1 with min-w-0 for bulletproof wrapping */}
                            <div className="flex-1 pr-2 min-w-0">
                                <h3 className={`text-[13px] md:text-[17px] font-medium leading-tight ${isPassed ? 'text-white' : 'text-text-muted'} transition-colors duration-300 tracking-wide`}>
                                    {station.stationName}
                                </h3>
                                
                                <p className="text-[10px] md:text-[12px] text-text-muted mt-1.5 flex flex-wrap items-center gap-1.5 font-medium">
                                    <span className="whitespace-nowrap">{station.distanceKm || '0'} km</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 px-1.5 py-[2px] rounded border border-border-custom bg-bg-input text-white whitespace-nowrap">
                                        PF {station.platform || '-'} 
                                        <Edit3 size={10} className="text-text-muted ml-0.5" />
                                    </span>
                                </p>


                            </div>

                            {/* Departure Column */}
                            <div className="w-[50px] md:w-[130px] flex flex-col justify-start items-end md:items-start pt-0 shrink-0">
                                {depSched !== '---' && depSched && (
                                    <span className="text-[10px] md:text-[14px] text-text-muted md:text-white font-medium leading-none tracking-wide text-right md:text-left">{depSched}</span>
                                )}
                                {depAct !== '--' && depAct !== depSched && depAct && (
                                    <span className="text-[10px] md:text-[14px] font-bold text-red-500 leading-tight mt-1 tracking-wide text-right md:text-left">{depAct}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Bottom Floating Status Dashboard */}
        {/* Adjusted bottom position to hover above the global Bottom Nav if loaded in Mobile App layout */}
        <div className="sticky bottom-0 md:bottom-0 left-0 w-full bg-bg-card border-t border-border-custom shadow-[0_-15px_40px_rgba(0,0,0,0.9)] p-3 md:p-4 md:px-8 flex justify-between items-center z-40 shrink-0 md:rounded-b-[24px]">
            <div className="flex-1 min-w-0 pr-4">
                <p className="text-red-400 font-semibold text-[13px] md:text-[18px] tracking-wide flex items-center gap-1.5 truncate">
                   {data.statusNote?.includes('Departed') ? 'Departed' : 'Arrived'} {activeStation?.stationName}
                </p>
                <p className="text-[9px] md:text-[11px] text-text-muted mt-1 font-medium tracking-wider uppercase truncate">Updated few seconds ago</p>
            </div>
            
            {/* Refresh FAB */}
            <button className="w-12 h-12 md:w-16 md:h-16 bg-accent text-bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(200,241,53,0.3)] hover:scale-105 active:scale-95 transition-transform shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
            </button>
        </div>

      </div>
    </div>
  );
};

export default LiveStatus;
