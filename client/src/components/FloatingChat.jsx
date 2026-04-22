import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 bg-accent text-bg-primary p-4 rounded-full shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle size={28} />
      </button>

      {/* Simplified Chat Popover */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 w-72 h-96 bg-bg-card border border-border-custom rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-bg-input p-4 border-b border-border-custom flex justify-between items-center">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            <div className="bg-bg-input text-gray-300 p-3 rounded-xl rounded-tl-sm text-sm self-start max-w-[85%]">
              Hello! Where are you travelling today?
            </div>
          </div>
          
          <div className="p-3 border-t border-border-custom bg-bg-primary/50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask something..." 
                className="w-full bg-bg-input border border-border-custom rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-accent focus:shadow-[0_0_8px_rgba(200,241,53,0.2)] transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent p-1">
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
