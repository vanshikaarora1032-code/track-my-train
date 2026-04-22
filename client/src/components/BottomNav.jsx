import { Train, Search, Ticket, Bookmark } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Train, label: 'Trains' },
    { path: '/pnr-status', icon: Search, label: 'PNR' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:right-auto md:w-24 lg:w-64 bg-bg-card border-t md:border-t-0 md:border-r border-border-custom px-6 py-2 md:py-12 z-50 transition-all shadow-[10px_0_30px_rgba(0,0,0,0.3)]">
      <div className="max-w-md mx-auto md:mx-0 w-full h-full flex md:flex-col justify-around md:justify-start items-center md:items-start md:gap-8 lg:px-6">
        
        {/* Desktop Logo Placeholder */}
        <div className="hidden md:flex flex-col items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent shadow-[0_0_15px_rgba(200,241,53,0.4)] flex items-center justify-center">
            <Train size={24} className="text-bg-primary" />
          </div>
        </div>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 min-w-[70px] ${
                isActive ? 'text-accent' : 'text-text-muted hover:text-white'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
