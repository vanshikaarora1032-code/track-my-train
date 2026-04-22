import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LiveStatus from './pages/LiveStatus';
import PnrStatus from './pages/PnrStatus';
import SeatAvailability from './pages/SeatAvailability';
import TrainSchedule from './pages/TrainSchedule';
import TrainList from './pages/TrainList';
import TrainAppLayout from './components/TrainAppLayout';
import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial App Loading Simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <TrainAppLayout>
              <Dashboard />
            </TrainAppLayout>
          } 
        />
        <Route 
          path="/train-list" 
          element={
            <TrainAppLayout>
              <TrainList />
            </TrainAppLayout>
          } 
        />
        <Route 
          path="/live-status" 
          element={
            <TrainAppLayout>
              <LiveStatus />
            </TrainAppLayout>
          } 
        />
        <Route 
          path="/pnr-status" 
          element={
            <TrainAppLayout>
              <PnrStatus />
            </TrainAppLayout>
          } 
        />
        <Route 
          path="/seat-availability" 
          element={
            <TrainAppLayout>
              <SeatAvailability />
            </TrainAppLayout>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <TrainAppLayout>
              <TrainSchedule />
            </TrainAppLayout>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
