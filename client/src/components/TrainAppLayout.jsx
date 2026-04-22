import BottomNav from './BottomNav';
import FloatingChat from './FloatingChat';

const TrainAppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-primary relative w-full pb-20 md:pb-0 md:pl-24 lg:pl-64 flex transition-all">
      
      {/* 
        Responsive Navigation Wrapper: 
        We use BottomNav on mobile. For tablet/desktop, we could move BottomNav rendering 
        into a sidebar. For now, BottomNav is styled globally, but we'll adapt its CSS 
        within BottomNav component to shift left on md+ screens.
      */}
      <BottomNav />

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto h-full relative z-10 px-4 md:px-8 py-4">
        {children}
      </main>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default TrainAppLayout;
